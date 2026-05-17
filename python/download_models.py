# download_models.py
import evaluate
from transformers import MarianMTModel, MarianTokenizer, AutoTokenizer, AutoModel

print("Downloading translation model to cache...")
model_checkpoint = "Helsinki-NLP/opus-mt-tl-en"
MarianTokenizer.from_pretrained(model_checkpoint)
MarianMTModel.from_pretrained(model_checkpoint, use_safetensors=True)

print("Downloading evaluation metrics to cache...")
evaluate.load("sacrebleu")
evaluate.load("chrf")
evaluate.load("bertscore")

print("Downloading COMET dependencies to cache...")
evaluate.load("comet")
AutoTokenizer.from_pretrained("xlm-roberta-large")
AutoModel.from_pretrained("xlm-roberta-large")

print("All models cached successfully! You can now run app.py offline.")