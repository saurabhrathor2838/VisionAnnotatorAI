import { AnnotationProvider } from "../components/Annotation/AnnotationContext";
import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import VideoPlayer from "../components/VideoPlayer/VideoPlayer";
import "../styles/annotation.css";
import AnnotationProperties from "../components/Annotation/AnnotationProperties";

function AnnotationWorkspace({
  video,
  originalVideoUrl,
  setVideo,
  uploadVideo,
  result,
  uploadProgress,
  uploadStatus,
  processedVideo,
}) {

  const [annotations, setAnnotations] = useState([]);

  const [selectedAnnotation, setSelectedAnnotation] = useState(null);
 // ==========================
// Label Display Settings
// ==========================

const [labelSettings, setLabelSettings] = useState({

  fields:{
    objectName:true,
    status:false,
    environment:false,
    context:false,
    id:false
  },

  position:"top-left"

});

  return (
    <AnnotationProvider>
      <div className="workspace">

      {/* Header */}
      <header className="header">
        <h1>VisionAnnotatorAI</h1>
        <p>AI Powered Video Annotation Platform</p>
      </header>

      {/* Toolbar */}
      <div className="toolbar">
        <button>Select</button>
        <button>Bounding Box</button>
        <button>Polygon</button>
        <button>Point</button>
        <button>Line</button>
        <button>Zoom</button>
        <button>Save</button>
      </div>

      {/* Main Layout */}
      <div className="main-layout">

        {/* Sidebar */}
        <Sidebar
          video={video}
          setVideo={setVideo}
          uploadVideo={uploadVideo}
          uploadProgress={uploadProgress}
          uploadStatus={uploadStatus}
        />

        {/* Video Area */}
        <main className="viewer-panel">
          <VideoPlayer
  video={video}
  originalVideoUrl={originalVideoUrl}
  result={result}
  processedVideo={processedVideo}

  annotations={annotations}
  setAnnotations={setAnnotations}

  selectedAnnotation={selectedAnnotation}
  setSelectedAnnotation={setSelectedAnnotation}

  labelSettings={labelSettings}
/>
        </main>

        {/* Right Panel */}
        <aside className="right-panel">

          <h3>Detection Result</h3>

          <div className="result-box">

            {!result ? (

              <p>Waiting for video processing...</p>

            ) : (

              <>

                <p>
                  <strong>Status:</strong> {result.status}
                </p>

                <p>
                  <strong>Processed Video:</strong>
                </p>

                <small>{result.processed_video}</small>

                <br />
                <br />

                <p>
                  <strong>Detection JSON:</strong>
                </p>

                <small>{result.detection_json}</small>

                {result.stats && (
                  <>
                    <hr />

                    <p>
                      <strong>Frames Processed:</strong>{" "}
                      {result.stats.totalFrames}
                    </p>

                    <p>
                      <strong>Total Objects:</strong>{" "}
                      {result.stats.totalObjects}
                    </p>

                    <hr />

                    <h4>Detected Classes</h4>

                    {Object.entries(result.stats.classCounts).map(
                      ([label, count]) => (
                        <p key={label}>
                          <strong>{label}</strong> : {count}
                        </p>
                      )
                    )}
                  </>
                )}

              </>

            )}

          </div>
          <hr />

            <AnnotationProperties

              selectedAnnotation={selectedAnnotation}

              annotations={annotations}

              setAnnotations={setAnnotations}

              setSelectedAnnotation={setSelectedAnnotation}

              labelSettings={labelSettings}

              setLabelSettings={setLabelSettings}

            />

        </aside>

      </div>

      {/* Timeline */}
      <div className="timeline">
        Timeline (Coming Soon)
      </div>

      {/* Status */}
            <footer className="statusbar">
        {uploadStatus}
      </footer>

    </div>
  </AnnotationProvider>
);
}

export default AnnotationWorkspace;