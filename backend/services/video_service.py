import cv2
from pathlib import Path
from services.yolo_service import YOLOService


class VideoService:

    def __init__(self):
        self.yolo = YOLOService()

    def process_video(self, video_path: str):

        video_path = Path(video_path)

        cap = cv2.VideoCapture(str(video_path))

        if not cap.isOpened():
            raise Exception("Video cannot be opened")

        fps = int(cap.get(cv2.CAP_PROP_FPS))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        results = []

        frame_number = 0

        while True:

            ret, frame = cap.read()

            if not ret:
                break

            # YOLO detection
            detections = self.yolo.detect(frame)

            results.append({
                "frame": frame_number,
                "time": round(frame_number / fps, 2),
                "objects": detections
            })

            frame_number += 1


        cap.release()


        return {
            "video": video_path.name,
            "fps": fps,
            "total_frames": total_frames,
            "detections": results
        }