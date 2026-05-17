# Rizal Exhibit: Translation & Evaluation Platform

This project is a full-stack application featuring a **Next.js** frontend and a **FastAPI** backend. It is designed to serve a baseline translation model (`Helsinki-NLP/opus-mt-tl-en`) alongside two custom LoRA adapters ("normalized" and "old" Tagalog). The platform also integrates advanced translation evaluation metrics (BLEU, chrF, BERTScore, and COMET) for interactive scoring.

Crucially, this application is configured to run in a **completely offline environment**, utilizing specific caching and dependency configurations to prevent network timeouts and security blocks.

---

## Project Architecture

### Frontend (Next.js: Rizal Exhibit)

The user interface is built with Next.js (App Router) to provide an interactive exhibit experience.

* **`/` (Homepage):** The landing page for the Rizal exhibit (`app/page.tsx`).
* **`/play` (Main Page):** The core interactive translation and evaluation interface (`app/play/page.tsx`).
* **`/leaderboard`:** A dedicated page to view saved translation scores and rankings (`app/leaderboard/page.tsx`).

### Backend (FastAPI)

The Python backend handles model inference and metric calculations locally.

* **`app.py`:** The main FastAPI server. Handles routing, generation, LoRA adapter switching, and offline metric evaluation. If you want to add sample excerpts please add it in here and restart the python app.py
* **`download_models.py`:** A one-time setup script to fetch and cache all Hugging Face assets.
* **`leaderboard.json`:** A local JSON file (auto-generated on first run) that persists leaderboard scores.

---

## Context: Offline Environment Challenges Solved

To ensure this application runs smoothly without an active internet connection, several critical overrides were implemented:

1. **The PyTorch Security Block (CVE-2025-32434):** PyTorch introduced a strict security patch blocking `torch.load` for `.bin` and `.ckpt` files (which the COMET metric relies on). Upgrading to **PyTorch 2.6.0+** was required to safely bypass this vulnerability check for local files.
2. **Hugging Face Auto-Conversion Pings:** Hugging Face libraries automatically attempt network pings to find safer `.safetensors` versions. This was solved by removing `use_safetensors=True` and enforcing the `local_files_only=True` flag to strictly read `.bin` weights from the cache.
3. **Strict Offline Environment Variables:** System variables are injected at the very top of `app.py` to ensure the Hub libraries never attempt external network requests.

---

## Deployment & Setup Instructions

This project implements a FastAPI server that serves a baseline translation model (`Helsinki-NLP/opus-mt-tl-en`) alongside two custom LoRA adapters (`normalized` and `old` Tagalog). It also integrates advanced translation evaluation metrics (BLEU, chrF, BERTScore, and COMET) for interactive scoring.

Because this application is designed to run in a **completely offline environment**, specific caching and dependency configurations have been established to prevent network timeouts and security blocks.

---

## How to Run This Project Locally

Follow these steps to set up the project on your machine after cloning from GitHub.

### Step 1: Clone the Repository
Open your terminal and clone the repository to your local machine:
```bash
git clone https://github.com/jimbarcos/rizal-exhibit
cd rizal-exhibit

```

*(Note: The custom LoRA adapters are already included in this repository, so you do not need to download them separately.)*

### Step 2: Set Up a Python Environment (Recommended)

It is highly recommended to use Python 3.10+ and create a virtual environment so these specific dependencies don't interfere with your other projects.

```bash
# Windows
cd python
python -m venv venv
venv\Scripts\activate

# Mac/Linux
dir python
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



### Step 5: Install Next js (Go to root /rizal-exhibit)

```bash
npm install

```

### Step 6: Run the Server Offline (Go to /python)

Once the base models are safely cached, you can completely disable your internet connection. The app is configured with strict offline environment variables.

Start the FastAPI server:

```bash
python app.py

```

### Step 7: Run Next js (Run this on different terminal with the root on /rizal-exhibit)

```bash
npm run dev

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

*The frontend will compile and be accessible at `http://localhost:3000`.*
