import { useState } from "react";
import axios from "axios";
import AnnotationWorkspace from "./pages/AnnotationWorkspace";

function App() {
  const [video, setVideo] = useState(null);
  const [result, setResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("Waiting...");

  const uploadVideo = async () => {
    if (!video) {
      alert("Please select a video first");
      return;
    }

    const formData = new FormData();
    formData.append("file", video);

    setUploadProgress(0);
    setUploadStatus("Uploading...");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },

          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );

            setUploadProgress(percent);
          },
        }
      );

      const data = response.data;

const stats = {
  totalFrames: data.detections.length,
  totalObjects: 0,
  classCounts: {},
};

data.detections.forEach((frame) => {
  stats.totalObjects += frame.objects.length;

  frame.objects.forEach((obj) => {
    const label = obj.label;

    if (!stats.classCounts[label]) {
      stats.classCounts[label] = 0;
    }

    stats.classCounts[label]++;
  });
});

setResult({
  ...data,
  stats,
});
      setUploadProgress(100);
      setUploadStatus("Completed ✅");
    } catch (error) {
      console.error(error);
      setResult("Upload failed. Backend connection error.");
      setUploadStatus("Failed ❌");
    }
  };

  return (
    <AnnotationWorkspace
  video={video}
  setVideo={setVideo}
  uploadVideo={uploadVideo}
  result={result}
  uploadProgress={uploadProgress}
  uploadStatus={uploadStatus}
  processedVideo={
  result?.processed_video
    ? `http://127.0.0.1:8000/${result.processed_video.replace(/\\/g, "/")}`
    : null
}
/>
  );
}

export default App;