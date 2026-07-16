from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
from pathlib import Path

from services.yolo_service import YOLOService


app = FastAPI(
    title="VisionAnnotator AI",
    version="1.1.0"
)


# ✅ CORS Fix for React Frontend (localhost:5174)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5174",
        "http://127.0.0.1:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")

UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)


# Load YOLO model once
yolo_service = YOLOService()


@app.get("/")
def home():
    return {
        "message": "VisionAnnotator AI is running 🚀"
    }


@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):

    input_path = UPLOAD_DIR / file.filename

    output_video_path = OUTPUT_DIR / f"processed_{file.filename}"

    json_name = f"{Path(file.filename).stem}.json"
    output_json_path = OUTPUT_DIR / json_name


    # Save uploaded file
    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)


    # Process video
    yolo_service.process_video(
        str(input_path),
        str(output_video_path),
        str(output_json_path)
    )


    return {
        "status": "completed",
        "original_video": str(input_path),
        "processed_video": str(output_video_path),
        "detection_json": str(output_json_path)
    }