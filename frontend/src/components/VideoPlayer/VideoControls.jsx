function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function VideoControls({
  isPlaying,
  onPlayPause,
  onPreviousFrame,
  onNextFrame,
  onFullscreen,
  currentTime,
  duration,
  frame,
  totalFrames,
  fps,
  onSeek,
  jumpFrame,
  setJumpFrame,
  onJumpToFrame,
  playbackSpeed,
  setPlaybackSpeed,
})
 {
  return (
    <div className="video-controls">

      <button
        onClick={onPreviousFrame}
        title="Previous Frame"
      >
        ⏮
      </button>

      <button
        onClick={onPlayPause}
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "⏸ Pause" : "▶ Play"}
      </button>

      <button
        onClick={onNextFrame}
        title="Next Frame"
      >
        ⏭
      </button>

      <button
        onClick={onFullscreen}
        title="Fullscreen"
      >
        ⛶
      </button>

      <input
        className="timeline-slider"
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        step="0.01"
        onChange={(e) => onSeek(Number(e.target.value))}
      />
      <div className="timeline-info">
        <div
           className="timeline-progress"
            style={{
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
        }}
      > </div>
</div>

      <div className="time-info">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      <div className="time-info">
        Frame : {frame} / {totalFrames}
      </div>

      <div className="time-info">
        FPS : {fps}
      </div>

      <div className="time-info">
  Speed:
  <select
    value={playbackSpeed}
    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
    style={{ marginLeft: "8px" }}
  >
    <option value={0.25}>0.25x</option>
    <option value={0.5}>0.5x</option>
    <option value={1}>1x</option>
    <option value={1.5}>1.5x</option>
    <option value={2}>2x</option>
  </select>
</div>

      <div className="jump-frame-controls">
        <input
          type="number"
          value={jumpFrame}
          onChange={(e) => setJumpFrame(e.target.value)}
          style={{ width: "80px" }}
       />

  <button onClick={onJumpToFrame}>
    GO
  </button>
</div>

    </div>
  );
}

export default VideoControls;