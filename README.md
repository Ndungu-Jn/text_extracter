# Image to text (React + FastAPI + Tesseract)

## Prerequisite: install the Tesseract engine
- Ubuntu/Debian: `sudo apt install tesseract-ocr`
- macOS: `brew install tesseract`
- Windows: install from https://github.com/UB-Mannheim/tesseract/wiki and add it to PATH

## Backend
```
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Frontend
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173
