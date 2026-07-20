import cv2

video = "outputs/processed_0714(1).mp4"

cap = cv2.VideoCapture(video)

print("Opened :", cap.isOpened())

print("FOURCC :", int(cap.get(cv2.CAP_PROP_FOURCC)))

cap.release()