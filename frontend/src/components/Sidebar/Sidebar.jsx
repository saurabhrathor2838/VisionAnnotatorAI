function Sidebar({
  video,
  setVideo,
  uploadVideo,
  uploadProgress,
  uploadStatus,
}) {
  return (
    <aside className="left-panel">
      <h3>📁 Project</h3>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
      />

      <br />
      <br />

      <button onClick={uploadVideo}>
        Upload Video
      </button>

      <hr />

      <h3>Selected File</h3>

      <p>
        {video ? video.name : "No file selected"}
      </p>

      <hr />

      <h3>Upload Progress</h3>

      <progress
        value={uploadProgress}
        max="100"
        style={{ width: "100%" }}
      ></progress>

      <p>{uploadProgress}%</p>

      <p>
        <strong>Status:</strong> {uploadStatus}
      </p>

      <hr />

      <h3>Annotation Mode</h3>

      <button>Manual</button>
      <button>AI Assisted</button>
      <button>Fully Automatic</button>
    </aside>
  );
}

export default Sidebar;