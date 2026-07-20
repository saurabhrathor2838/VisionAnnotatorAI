import cv2

video_path = "outputs/processed_0714(1).mp4"

cap = cv2.VideoCapture(video_path)

print("Opened :", cap.isOpened())
print("Frames :", int(cap.get(cv2.CAP_PROP_FRAME_COUNT)))
print("FPS :", cap.get(cv2.CAP_PROP_FPS))

ret, frame = cap.read()
print("First Frame :", ret)

if ret:
    print("Frame Shape :", frame.shape)

cap.release()