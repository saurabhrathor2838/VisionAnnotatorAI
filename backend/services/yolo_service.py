import cv2
import json
from ultralytics import YOLO


class YOLOService:
    """
    Service responsible for loading the YOLO model
    and processing videos.
    """

    def __init__(self, model_path: str = "yolov8n.pt"):
        print(f"Loading YOLO model: {model_path}")
        self.model = YOLO(model_path)
        print("YOLO model loaded successfully.")

    def get_model(self):
        return self.model

    def process_video(
        self,
        input_video_path: str,
        output_video_path: str,
        output_json_path: str
    ):

        cap = cv2.VideoCapture(input_video_path)

        if not cap.isOpened():
            raise Exception(f"Could not open video: {input_video_path}")

        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)

        if fps == 0:
            fps = 30

        fourcc = cv2.VideoWriter_fourcc(*"mp4v")

        out = cv2.VideoWriter(
            output_video_path,
            fourcc,
            fps,
            (width, height)
        )

        frame_number = 0
        detection_data = []

        while True:

            success, frame = cap.read()

            if not success:
                break

            frame_number += 1

            results = self.model(frame)

            annotated_frame = results[0].plot()

            out.write(annotated_frame)

            frame_objects = []

            for box in results[0].boxes:

                cls = int(box.cls[0])
                conf = float(box.conf[0])

                x1, y1, x2, y2 = box.xyxy[0].tolist()

                frame_objects.append({
                    "label": self.model.names[cls],
                    "confidence": round(conf, 3),
                    "bbox": [
                        round(x1, 2),
                        round(y1, 2),
                        round(x2, 2),
                        round(y2, 2)
                    ]
                })

            detection_data.append({
                "frame": frame_number,
                "objects": frame_objects
            })

        cap.release()
        out.release()

        with open(output_json_path, "w") as f:
            json.dump(detection_data, f, indent=4)

        print(f"Processed {frame_number} frames.")
        print(f"Video saved to: {output_video_path}")
        print(f"Detection JSON saved to: {output_json_path}")