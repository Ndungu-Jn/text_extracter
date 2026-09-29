import io

import pytesseract
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageOps, UnidentifiedImageError

MAX_BYTES = 10 * 1024 * 1024  # 10 MB

app = FastAPI(title="OCR API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["POST"],
    allow_headers=["*"],
)


def prepare_image(data: bytes) -> Image.Image:
    """Decode the upload and convert it to a format Tesseract handles well."""
    try:
        img = Image.open(io.BytesIO(data))
        img = ImageOps.exif_transpose(img)  # fix phone-camera rotation
    except (UnidentifiedImageError, OSError):
        raise HTTPException(
            status_code=415, detail="That file isn't a readable image.")
    return img.convert("L")  # grayscale


@app.post("/api/ocr")
async def ocr(file: UploadFile = File(...)):
    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(
            status_code=413, detail="Image is larger than 10 MB.")

    img = prepare_image(data)
    try:
        text = pytesseract.image_to_string(img)
    except pytesseract.TesseractNotFoundError:
        raise HTTPException(
            status_code=500, detail="Tesseract is not installed on the server.")

    return {"text": text.strip()}
