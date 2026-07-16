from fastapi import FastAPI, UploadFile, File
import shutil
from pathlib import Path

from services.yolo_service import YOLOService

app = FastAPI(
    title="VisionAnnotator AI",
    version="1.0.0"
)

UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")

UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Load YOLO model once when the application starts
yolo_service = YOLOService()


@app.get("/")
def home():
    return {
        "message": "VisionAnnotator AI is running 🚀"
    }


@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    input_path = UPLOAD_DIR / file.filename
    output_path = OUTPUT_DIR / f"processed_{file.filename}"

    # Save uploaded video
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Process video with YOLO
    yolo_service.process_video(
        str(input_path),
        str(output_path)
    )

    return {
        "message": "Video uploaded and processed successfully",
        "original_video": str(input_path),
        "processed_video": str(output_path)
    }