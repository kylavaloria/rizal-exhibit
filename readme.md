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

### 1. Install Backend Dependencies

Install the required Python packages using the provided `requirements.txt` file. Using `python -m pip` ensures the packages are installed in your exact active Python environment.

```bash
python -m pip install -r requirements.txt

```

### 2. Cache the Models (Requires Temporary Internet Access)

Before running the application offline, you **must** download the base models, tokenizers, and evaluation metrics into your local Hugging Face cache (`~/.cache/huggingface/`).

Ensure you are connected to the internet and run the caching script:

```bash
python download_models.py

```

*Wait for all downloads to finish. You should see a confirmation message: "All models cached successfully!"*

### 3. Run the Backend Server Offline

Once the models are safely cached and PyTorch is updated, you can safely disable your internet connection. Start the FastAPI server:

```bash
python app.py

```

*The server will boot using Uvicorn, load the models locally, and become available at `http://localhost:8000`.*

### 4. Run the Next.js Frontend

In a separate terminal instance, start the Next.js development server to interact with the exhibit UI:

```bash
npm run dev

```

*The frontend will compile and be accessible at `http://localhost:3000`.*