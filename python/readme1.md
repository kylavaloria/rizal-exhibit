# Rizal Translation API - Offline Deployment Guide

This project implements a FastAPI server that serves a baseline translation model (`Helsinki-NLP/opus-mt-tl-en`) alongside two custom LoRA adapters (`normalized` and `old` Tagalog). It also integrates advanced translation evaluation metrics (BLEU, chrF, BERTScore, and COMET) for interactive scoring.

Because this application is designed to run in a **completely offline environment**, specific caching and dependency configurations have been established to prevent network timeouts and security blocks.

---

## How to Run This Project Locally

Follow these steps to set up the project on your machine after cloning from GitHub.

### Step 1: Clone the Repository
Open your terminal and clone the repository to your local machine:
```bash
git clone ...
cd ...

```

*(Note: The custom LoRA adapters are already included in this repository, so you do not need to download them separately.)*

### Step 2: Set Up a Python Environment (Recommended)

It is highly recommended to use Python 3.10+ and create a virtual environment so these specific dependencies don't interfere with your other projects.

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate

```

### Step 3: Install Dependencies

Install the required packages using the provided `requirements.txt` file.
*Note: This will install PyTorch 2.6.0+, which is strictly required to bypass a recent PyTorch security vulnerability block (CVE-2025-32434) when loading local model files.*

```bash
python -m pip install -r requirements.txt

```

### Step 4: Cache the Base Models (Requires Temporary Internet Access)

While the custom LoRA adapters are included in the repo, the massive Hugging Face base models, tokenizers, and evaluation metrics need to be downloaded to your machine's local cache (`~/.cache/huggingface/`).

Ensure you are connected to the internet and run the setup script:

```bash
python download_models.py

```

*Wait for all downloads to finish. You should see a success message when it is complete.*

### Step 5: Run the Server Offline

Once the base models are safely cached, you can completely disable your internet connection. The app is configured with strict offline environment variables.

Start the FastAPI server:

```bash
python app.py

```

The server will boot up using `uvicorn` and load the models locally. The API will be immediately available at:
**`http://localhost:3000`**

---

## File Structure Overview

* **`app.py`**: The main FastAPI application. Handles routing, model generation, LoRA adapter switching, and offline metric evaluation.
* **`download_models.py`**: A one-time setup script utilized to fetch and cache all necessary Hugging Face base assets.
* **`requirements.txt`**: The exact package dependencies required to run the environment safely.
* **`rizal-lora-adapters-*/`**: The custom fine-tuned weights for the normalized and historical Tagalog translations.
* **`leaderboard.json`**: A local JSON file (auto-generated on the first run) that persists the leaderboard scores.