import cv2
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

    def process_video(self, input_video_path: str, output_video_path: str):
        """
        Read a video, run YOLO on every frame,
        draw bounding boxes and save a processed video.
        """

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

        frame_count = 0

        while True:
            success, frame = cap.read()

            if not success:
                break

            frame_count += 1

            results = self.model(frame)

            annotated_frame = results[0].plot()

            out.write(annotated_frame)

        cap.release()
        out.release()

        print(f"Processed {frame_count} frames.")
        print(f"Output saved to: {output_video_path}")