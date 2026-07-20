import cv2
import json
import os
import subprocess

from ultralytics import YOLO


class YOLOService:
    """
    Service responsible for loading YOLO model
    and performing object detection.
    """

    def __init__(self, model_path: str = "yolov8n.pt"):

        print(f"Loading YOLO model: {model_path}")

        self.model = YOLO(model_path)

        print("YOLO model loaded successfully.")

    def get_model(self):
        return self.model

    def detect(self, frame):
        """
        Detect objects in a single frame.
        Used by VideoService.
        """

        results = self.model(frame)

        objects = []

        for box in results[0].boxes:

            cls = int(box.cls[0])
            conf = float(box.conf[0])

            x1, y1, x2, y2 = box.xyxy[0].tolist()

            objects.append(
                {
                    "label": self.model.names[cls],
                    "confidence": round(conf, 3),
                    "bbox": [
                        round(x1, 2),
                        round(y1, 2),
                        round(x2, 2),
                        round(y2, 2),
                    ],
                }
            )

        return objects

    def process_video(
        self,
        input_video_path: str,
        output_video_path: str,
        output_json_path: str,
    ):

        cap = cv2.VideoCapture(input_video_path)

        if not cap.isOpened():
            raise Exception(f"Could not open video: {input_video_path}")

        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

        fps = cap.get(cv2.CAP_PROP_FPS)

        if fps == 0:
            fps = 30

        temp_output_video = output_video_path.replace(
            ".mp4",
            "_temp.mp4",
        )

        fourcc = cv2.VideoWriter_fourcc(*"mp4v")

        out = cv2.VideoWriter(
            temp_output_video,
            fourcc,
            fps,
            (width, height),
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

            objects = self.detect(frame)

            detection_data.append(
                {
                    "frame": frame_number,
                    "objects": objects,
                }
            )

        cap.release()
        out.release()

        # Convert to browser-compatible H.264
        ffmpeg_cmd = [
            "ffmpeg",
            "-y",
            "-i",
            temp_output_video,
            "-c:v",
            "libx264",
            "-pix_fmt",
            "yuv420p",
            "-movflags",
            "+faststart",
            output_video_path,
        ]

        try:

            subprocess.run(
                ffmpeg_cmd,
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )

            if os.path.exists(temp_output_video):
                os.remove(temp_output_video)

            print("FFmpeg conversion completed successfully.")

        except subprocess.CalledProcessError as e:

            print("FFmpeg conversion failed.")
            print(e.stderr.decode())

            if os.path.exists(temp_output_video):
                os.replace(
                    temp_output_video,
                    output_video_path,
                )

        with open(output_json_path, "w") as f:

            json.dump(
                detection_data,
                f,
                indent=4,
            )

        print(f"Processed {frame_number} frames.")
        print(f"Video saved: {output_video_path}")
        print(f"JSON saved: {output_json_path}")