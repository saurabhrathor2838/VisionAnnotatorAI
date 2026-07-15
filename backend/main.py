from fastapi import FastAPI

app = FastAPI(
    title="VisionAnnotator AI",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "message": "VisionAnnotator AI is running 🚀"
    }