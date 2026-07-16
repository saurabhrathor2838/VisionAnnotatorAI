import { useState } from "react";
import "./App.css";

function App() {

  const [video, setVideo] = useState(null);
  const [result, setResult] = useState("");

  const uploadVideo = async () => {

    if (!video) {
      alert("Please select video first");
      return;
    }

    const formData = new FormData();
    formData.append("file", video);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/upload",
        {
          method: "POST",
          body: formData
        }
      );


      const data = await response.json();

      setResult(JSON.stringify(data, null, 2));


    } catch (error) {

      console.log(error);
      setResult("Upload failed. Backend connection error.");

    }

  };


  return (

    <div className="app">

      <header>
        <h1>VisionAnnotatorAI</h1>
        <p>
          AI Powered Video Annotation Platform
        </p>
      </header>


      <section className="dashboard">


        <div className="card">

          <h2>Upload Video</h2>


          <input
            type="file"
            accept="video/*"
            onChange={(e) =>
              setVideo(e.target.files[0])
            }
          />


          <button onClick={uploadVideo}>
            Upload
          </button>


        </div>



        <div className="card">

          <h2>Annotation Mode</h2>


          <button>
            Manual
          </button>


          <button>
            AI Assisted
          </button>


          <button>
            Fully Automatic
          </button>


        </div>




        <div className="card">

          <h2>Detection Result</h2>


          <pre>
            {result || "Waiting for video processing..."}
          </pre>


        </div>


      </section>


    </div>

  );

}


export default App;