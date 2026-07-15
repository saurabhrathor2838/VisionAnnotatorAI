from fastapi import FastAPI, UploadFile, File
import shutil
from pathlib import Path

app = FastAPI(
    title="VisionAnnotator AI",
    version="1.0.0"
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "VisionAnnotator AI is running 🚀"
    }


@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "message": "Video uploaded successfully",
        "filename": file.filename,
        "saved_to": str(file_path)
    }