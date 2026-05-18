# app.py
import os

# --- MUST BE AT THE VERY TOP ---
# Force Hugging Face libraries to look ONLY in the local cache
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_DATASETS_OFFLINE"] = "1"
os.environ["EVALUATE_OFFLINE"] = "1"
os.environ["HF_HUB_OFFLINE"] = "1"

import json
import random
import evaluate
import numpy as np

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from transformers import MarianMTModel, MarianTokenizer
from peft import PeftModel

# Load metrics globally so they don't reload on every request
bleu_metric = evaluate.load("sacrebleu")
chrf_metric = evaluate.load("chrf")
bertscore_metric = evaluate.load("bertscore")
comet_metric = evaluate.load("comet")

LEADERBOARD_FILE = "leaderboard.json"

# Initialize leaderboard file if it doesn't exist
if not os.path.exists(LEADERBOARD_FILE):
    with open(LEADERBOARD_FILE, "w") as f:
        json.dump([], f)

app = FastAPI(title="Rizal Translation API")

# Allow Next.js frontend to communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading Base Model...")
model_checkpoint = "Helsinki-NLP/opus-mt-tl-en"
tokenizer = MarianTokenizer.from_pretrained(model_checkpoint, local_files_only=True)

# Remove use_safetensors=True so it doesn't try to auto-convert via the web
base_model = MarianMTModel.from_pretrained(
    model_checkpoint, 
    local_files_only=True
)

print("Loading LoRA Adapters...")
adapter_normalized = "rizal-lora-adapters-v3-final_normalized_tagalog"
adapter_old = "rizal-lora-adapters-v3-final_old_tagalog"
adapter_combined = "rizal-lora-adapters-v3-final_combined_tagalog"

# 1. Wrap the base model with your first adapter and name it
model = PeftModel.from_pretrained(base_model, adapter_normalized, adapter_name="normalized")

# 2. Load the additional adapters into the same model and name them
model.load_adapter(adapter_old, adapter_name="old")
model.load_adapter(adapter_combined, adapter_name="combined")

device = "cuda" if torch.cuda.is_available() else "cpu"
model.to(device)
model.eval()

class TranslationRequest(BaseModel):
    text: str

def generate_translation(text: str) -> str:
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=128).to(device)
    with torch.no_grad():
        outputs = model.generate(**inputs, num_beams=4, max_new_tokens=128)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

@app.post("/api/translate")
async def translate_text(req: TranslationRequest):
    # 1. Generate Translation: Normalized Tagalog LoRA
    model.set_adapter("normalized")
    improved_normalized_output = generate_translation(req.text)
    
    # 2. Generate Translation: Old Tagalog LoRA
    model.set_adapter("old")
    improved_old_output = generate_translation(req.text)

    # 3. Generate Translation: Combined Tagalog LoRA
    model.set_adapter("combined")
    improved_combined_output = generate_translation(req.text)
    
    # 4. Generate Translation: Baseline (Disable all adapters)
    with model.disable_adapter():
        baseline_output = generate_translation(req.text)
        
    return {
        "source": req.text,
        "baseline": baseline_output,
        "improved_normalized": improved_normalized_output,
        "improved_old": improved_old_output,
        "improved_combined": improved_combined_output
    }

# --- GAME DATA & MODELS ---
class EvaluationRequest(BaseModel):
    user_translation: str
    source_text: str
    reference_text: str

class ScoreEntry(BaseModel):
    nickname: str
    score: float
    difficulty: str

EXCERPTS = [
    {
        "source": "Sa aking pagkabata ay natutuhan ko na ang katotohanan.",
        "reference": "In my childhood I learned the truth.",
        "difficulty": "Easy"
    },
    {
        "source": "Wala akong kasalanan!",
        "reference": "I am not guilty!",
        "difficulty": "Easy"
    },
    {
        "source": "Sino ang nag-sabi sa iyo na ako'y aalis?",
        "reference": "Who told you that I was leaving?",
        "difficulty": "Easy"
    },
    {
        "source": "Ang kalayaan ay hindi kailanman ibibigay ng malupit na may kapangyarihan.",
        "reference": "Freedom is never voluntarily given by the oppressor.",
        "difficulty": "Medium"
    },
    {
        "source": "Ang hindi marunong lumingon sa pinanggalingan ay hindi makakarating sa paroroonan.",
        "reference": "He who does not know how to look back at where he came from will never get to his destination.",
        "difficulty": "Medium"
    },
    {
        "source": "Masdan mo ang araw na iyan; hindi pa sumisikat ay kinakailangan na niyang lumubog.",
        "reference": "Look at that sun; before it rises it must set.",
        "difficulty": "Medium"
    },
    {
        "source": "Caya acó pumayag,—anáng unang tinig;—¡ipinagágamot ni don Crisóstomo ang aking asawa sa bahay ñg isáng médico sa Maynilà!",
        "reference": "That is why I agreed, said the first voice; Don Crisostomo is having my wife treated in the house of a doctor in Manila!",
        "difficulty": "Hard"
    },
    {
        "source": "Walang sumagot. Ang mg̃a babaye'y nagtinginan. Ang Capitán General ay nagng̃alit ang mg̃a bagang.",
        "reference": "No one answered. The women looked at one another. The Captain General ground his teeth.",
        "difficulty": "Hard"
    },
    {
        "source": "¡Baborp! estriborp! bubunutin ñg mg̃a marino ang kaniláng mahahabàng tikín at isasaksák sa isá’t isáng gilid at pinipigil sa tulong ñg kaniláng mg̃a hità’t balikat na másadsád sa dakong iyon ang bapor.",
        "reference": "Port! Starboard! the sailors will pull out their long poles and thrust them into each side and hold back the boat with the help of their thighs and shoulders from hitting that side.",
        "difficulty": "Hard"
    }
]

def calculate_metrics(prediction: str, reference: str, source: str):
    """Helper function to run the evaluation metrics."""
    bleu = bleu_metric.compute(predictions=[prediction], references=[[reference]])["score"]
    chrf = chrf_metric.compute(predictions=[prediction], references=[reference])["score"]
    bert = bertscore_metric.compute(predictions=[prediction], references=[reference], lang="en")["f1"][0]
    comet = comet_metric.compute(predictions=[prediction], references=[reference], sources=[source])["scores"][0]
    
    return {
        "text": prediction,
        "bleu": round(bleu, 2),
        "chrf": round(chrf, 2),
        "bertscore": round(bert, 3),
        "comet": round(comet, 3)
    }

@app.get("/api/prompt")
async def get_random_prompt(difficulty: str = "All"):
    """Returns a random Tagalog excerpt, optionally filtered by difficulty."""
    if difficulty != "All":
        filtered_excerpts = [p for p in EXCERPTS if p["difficulty"].lower() == difficulty.lower()]
        if filtered_excerpts:
            return random.choice(filtered_excerpts)
            
    return random.choice(EXCERPTS)

@app.post("/api/evaluate")
async def evaluate_translation(req: EvaluationRequest):
    """Generates AI translations and scores everyone against the reference."""
    user_scores = calculate_metrics(req.user_translation, req.reference_text, req.source_text)
    
    with model.disable_adapter():
        base_text = generate_translation(req.source_text)
    base_scores = calculate_metrics(base_text, req.reference_text, req.source_text)
    
    model.set_adapter("normalized")
    improved_norm_text = generate_translation(req.source_text)
    improved_norm_scores = calculate_metrics(improved_norm_text, req.reference_text, req.source_text)

    model.set_adapter("old")
    improved_old_text = generate_translation(req.source_text)
    improved_old_scores = calculate_metrics(improved_old_text, req.reference_text, req.source_text)

    model.set_adapter("combined")
    improved_combined_text = generate_translation(req.source_text)
    improved_combined_scores = calculate_metrics(improved_combined_text, req.reference_text, req.source_text)
    
    # User wins if they beat the highest scoring AI model
    user_won = user_scores["comet"] > max(
        improved_norm_scores["comet"], 
        improved_old_scores["comet"],
        improved_combined_scores["comet"]
    )
    
    return {
        "user": user_scores,
        "baseline": base_scores,
        "improved_normalized": improved_norm_scores,
        "improved_old": improved_old_scores,
        "improved_combined": improved_combined_scores,
        "user_won": user_won,
        "final_score": user_scores["comet"] * 100 
    }

@app.get("/api/leaderboard")
async def get_leaderboard():
    with open(LEADERBOARD_FILE, "r") as f:
        scores = json.load(f)
    return sorted(scores, key=lambda x: x["score"], reverse=True)[:10]

@app.post("/api/leaderboard")
async def add_leaderboard_score(entry: ScoreEntry):
    with open(LEADERBOARD_FILE, "r") as f:
        scores = json.load(f)
    
    scores.append(entry.dict())
    
    with open(LEADERBOARD_FILE, "w") as f:
        json.dump(scores, f, indent=4)
    
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)