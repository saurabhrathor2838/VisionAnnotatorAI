import { useEffect, useMemo, useRef, useState } from "react";
import VideoControls from "./VideoControls";
import AnnotationCanvas from "../Annotation/AnnotationCanvas";
import "./VideoPlayer.css";

function VideoPlayer({ video, processedVideo }) {
  const videoRef = useRef(null);
  const [videoSize, setVideoSize] = useState({
  width: 640,
  height: 360,
});

  const [showProcessed, setShowProcessed] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const FPS = 30;

  const [frame, setFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [jumpFrame, setJumpFrame] = useState("");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Create URL for uploaded video
  const originalVideoURL = useMemo(() => {
    if (!video) return "";
    return URL.createObjectURL(video);
  }, [video]);

  // Cleanup Blob URL
  useEffect(() => {
    return () => {
      if (originalVideoURL) {
        URL.revokeObjectURL(originalVideoURL);
      }
    };
  }, [originalVideoURL]);

  // ✅ Playback Speed Apply
  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.playbackRate = playbackSpeed;
}, [playbackSpeed]);

  // Current Source
  const currentSource = showProcessed
    ? processedVideo
    : originalVideoURL;

  // Reload video whenever source changes
  useEffect(() => {
    if (!videoRef.current) return;

    const player = videoRef.current;

    player.pause();

    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setFrame(0);

    player.load();
  }, [currentSource]);

  useEffect(() => {
  const handleKeyDown = (event) => {
    // अगर user input/select/textarea में typing कर रहा है
    // तो shortcuts काम नहीं करेंगे
    const tag = document.activeElement?.tagName;

    if (
      tag === "INPUT" ||
      tag === "TEXTAREA" ||
      tag === "SELECT"
    ) {
      return;
    }

    switch (event.code) {
      case "Space":
        event.preventDefault();
        togglePlayPause();
        break;

      case "ArrowLeft":
        event.preventDefault();
        previousFrame();
        break;

      case "ArrowRight":
        event.preventDefault();
        nextFrame();
        break;

      case "KeyF":
        event.preventDefault();
        toggleFullscreen();
        break;

      default:
        break;
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [
  isPlaying,
  frame,
  totalFrames,
  playbackSpeed,
]);

  if (!video) {
    return (
      <div className="video-placeholder">
        Select and upload a video to start annotation
      </div>
    );
  }

  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (videoRef.current.paused) {
        await videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeek = (time) => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = time;
    setCurrentTime(time);
    setFrame(Math.floor(time * FPS));
  };

  const jumpToFrame = () => {
  if (!videoRef.current) return;

  const targetFrame = Number(jumpFrame);

  // Validation
  if (
    isNaN(targetFrame) ||
    targetFrame < 0 ||
    targetFrame > totalFrames
  ) {
    alert(`Please enter a frame between 0 and ${totalFrames}`);
    return;
  }

  const targetTime = targetFrame / FPS;

  videoRef.current.currentTime = targetTime;

  setCurrentTime(targetTime);
  setFrame(targetFrame);
};

  const previousFrame = () => {
  if (!videoRef.current) return;

  videoRef.current.pause();

  const currentFrame = Math.round(videoRef.current.currentTime * FPS);
  const newFrame = Math.max(0, currentFrame - 1);
  const newTime = newFrame / FPS;

  videoRef.current.currentTime = newTime;

  setCurrentTime(newTime);
  setFrame(newFrame);
  setIsPlaying(false);
};

 const nextFrame = () => {
  if (!videoRef.current) return;

  videoRef.current.pause();

  const currentFrame = Math.round(videoRef.current.currentTime * FPS);
  const newFrame = Math.min(totalFrames, currentFrame + 1);
  const newTime = newFrame / FPS;

  videoRef.current.currentTime = newTime;

  setCurrentTime(newTime);
  setFrame(newFrame);
  setIsPlaying(false);
};

  const toggleFullscreen = () => {
  if (!videoRef.current) return;

  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    videoRef.current.requestFullscreen();
  }
};

const handleLoadedMetadata = () => {
  if (!videoRef.current) return;

  const videoDuration = videoRef.current.duration;

  setDuration(videoDuration);
  setCurrentTime(0);
  setFrame(0);

  const total = Math.floor(videoDuration * FPS);
  setTotalFrames(total);

  setVideoSize({
    width: videoRef.current.clientWidth,
    height: videoRef.current.clientHeight,
  });
};

  const handleTimeUpdate = () => {
  if (!videoRef.current) return;

  const time = videoRef.current.currentTime;

  setCurrentTime(time);

  const currentFrame = Math.round(time * FPS);

  setFrame(currentFrame);
};

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="video-player-container">

      <div style={{ marginBottom: "10px", display: "flex", gap: "10px" }}>
        <button
          onClick={() => setShowProcessed(false)}
          disabled={!video}
        >
          Original Video
        </button>

        <button
  disabled={!processedVideo}
  onClick={() => {
    if (!processedVideo) return;

    setShowProcessed(true);
  }}
>
  AI Processed Video
</button>
      </div>

<div className="video-wrapper">
      <video
    key={currentSource}
    ref={videoRef}
    src={currentSource}
    controls={false}
    preload="metadata"
    style={{
    display: "block",
    maxWidth: "100%",
    maxHeight: "650px",
    width: "auto",
    height: "auto",
    background: "#000",
}}
    onLoadedMetadata={handleLoadedMetadata}
    onPlay={handlePlay}
    onPause={handlePause}
    onEnded={handleEnded}
    onTimeUpdate={handleTimeUpdate}
    onError={(e) => {
        console.log("Video URL =", currentSource);
        console.log(e.target.error);
    }}
/>

 <AnnotationCanvas
  width={videoSize.width}
  height={videoSize.height}
  video={video}
/>

</div>

      <VideoControls
      isPlaying={isPlaying}
      onPlayPause={togglePlayPause}
      onPreviousFrame={previousFrame}
      onNextFrame={nextFrame}
      onFullscreen={toggleFullscreen}
      currentTime={currentTime}
      duration={duration}
      frame={frame}
      totalFrames={totalFrames}
      fps={FPS}
      onSeek={handleSeek}
      jumpFrame={jumpFrame}
      setJumpFrame={setJumpFrame}
      onJumpToFrame={jumpToFrame}
      playbackSpeed={playbackSpeed}
      setPlaybackSpeed={setPlaybackSpeed}
/>

    </div>
  );
}

export default VideoPlayer;