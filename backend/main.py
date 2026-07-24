from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

import shutil
import json
from pathlib import Path

from services.video_service import VideoService


app = FastAPI(
    title="VisionAnnotator AI",
    version="1.1.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)



UPLOAD_DIR = Path("uploads")
OUTPUT_DIR = Path("outputs")


UPLOAD_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)



# Static output access
app.mount(
    "/outputs",
    StaticFiles(directory="outputs"),
    name="outputs"
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

# Load AI service once
video_service = VideoService()



@app.get("/")
def home():

    return {
        "message": "VisionAnnotator AI is running 🚀"
    }




@app.post("/upload")
async def upload_video(
    file: UploadFile = File(...)
):


    input_path = (
        UPLOAD_DIR /
        file.filename
    )


    output_video_path = (
        OUTPUT_DIR /
        f"processed_{file.filename}"
    )


    json_name = (
        f"{Path(file.filename).stem}.json"
    )


    output_json_path = (
        OUTPUT_DIR /
        json_name
    )



    # Save uploaded video

    with open(
        input_path,
        "wb"
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer
        )



    # Run detection pipeline

    video_service.yolo.process_video(
        str(input_path),
        str(output_video_path),
        str(output_json_path)
    )



    # Load detection result

    with open(
        output_json_path,
        "r"
    ) as f:

        detection_data = json.load(f)




    return {

        "status": "completed",

        "original_video":
    f"/uploads/{input_path.name}",


        "processed_video":
            f"/video/{output_video_path.name}",


        "detection_json":
            str(output_json_path),


        "detections":
            detection_data
    }
@app.get("/video/{filename}")
async def get_processed_video(filename: str):

    video_path = OUTPUT_DIR / filename

    if not video_path.exists():
        return {
            "error": "Video not found"
        }

    return FileResponse(
        path=str(video_path),
        media_type="video/mp4",
        headers={
            "Content-Disposition": "inline"
        }
    )