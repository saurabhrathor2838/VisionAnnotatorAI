import React, { useRef, useEffect, useState } from "react";
import { getAnnotationAtPoint } from "./SelectionUtils";

function getResizeHandle(box, x, y) {

  const size = 10;

  const handles = {
    topLeft: {
      x: box.x,
      y: box.y
    },

    topRight: {
      x: box.x + box.width,
      y: box.y
    },

    bottomLeft: {
      x: box.x,
      y: box.y + box.height
    },

    bottomRight: {
      x: box.x + box.width,
      y: box.y + box.height
    }
  };


  for (const key in handles) {

    const handle = handles[key];


    if(
      Math.abs(x - handle.x) < size &&
      Math.abs(y - handle.y) < size
    ){
      return key;
    }

  }


  return null;
}

function AnnotationCanvas({ width, height, video }) {
  const canvasRef = useRef(null);

  const [annotations, setAnnotations] = useState([]);
  // ==========================
// Undo / Redo History
// ==========================

const [history, setHistory] = useState([
  []
]);

const [historyIndex, setHistoryIndex] = useState(0);

const [redoIndex, setRedoIndex] = useState(0);

// ==========================
// Save History Snapshot
// ==========================

const saveHistory = (newAnnotations) => {

  setHistory(prevHistory => {

    const trimmed = prevHistory.slice(
      0,
      historyIndex + 1
    );


    const updatedHistory = [
      ...trimmed,
      JSON.parse(JSON.stringify(newAnnotations))
    ];


    setHistoryIndex(
      updatedHistory.length - 1
    );


    return updatedHistory;

  });

};
   useEffect(() => {

  if(!video) return;


  // New video load hone par clear

  setAnnotations([]);

  setHistory([
    []
  ]);

  setHistoryIndex(0);


}, [video]);

  const [drawing, setDrawing] = useState(false);

  const [currentBox, setCurrentBox] = useState(null);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const [isMoving, setIsMoving] = useState(false);
  const [moveOffset, setMoveOffset] = useState(null);
  const [resizeHandle, setResizeHandle] = useState(null);
  
  // Mouse Down...

  // ==========================
  // Mouse Down
  // ==========================
  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // ==========================
// Check Resize Handle
// ==========================

if (selectedIndex !== -1) {

  const selectedBox = annotations[selectedIndex];

  const handle = getResizeHandle(
    selectedBox,
    x,
    y
  );


  if(handle){

    setResizeHandle(handle);

    return;

  }

}

    const clickedIndex = getAnnotationAtPoint(
  annotations,
  x,
  y
);

if (clickedIndex !== -1) {

  setSelectedIndex(clickedIndex);

  const selectedBox = annotations[clickedIndex];

  setIsMoving(true);

  setMoveOffset({
    x: x - selectedBox.x,
    y: y - selectedBox.y,
  });

  return;
}
setSelectedIndex(-1);

    setDrawing(true);

    setCurrentBox({
        x,
        y,
        width: 0,
        height: 0,
        label: "Object"
    });
};

  // ==========================
  // Mouse Move
  // ==========================
  const handleMouseMove = (e) => {

  const rect = canvasRef.current.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // ==========================
// Resize Existing Rectangle
// ==========================

if (
  resizeHandle &&
  selectedIndex !== -1
) {

  setAnnotations(prev => {

    const updated = [...prev];

    const box = {
      ...updated[selectedIndex]
    };


    if(resizeHandle === "topLeft"){

      box.width =
        box.x + box.width - x;

      box.height =
        box.y + box.height - y;

      box.x = x;
      box.y = y;

    }


    if(resizeHandle === "topRight"){

      box.width =
        x - box.x;

      box.height =
        box.y + box.height - y;

      box.y = y;

    }


    if(resizeHandle === "bottomLeft"){

      box.width =
        box.x + box.width - x;

      box.x = x;

      box.height =
        y - box.y;

    }


    if(resizeHandle === "bottomRight"){

      box.width =
        x - box.x;

      box.height =
        y - box.y;

    }


    updated[selectedIndex] = box;

    return updated;

  });


  return;

}

  // ==========================
  // Moving Existing Rectangle
  // ==========================

  if (isMoving && selectedIndex !== -1 && moveOffset) {

    setAnnotations(prev => {

      const updated = [...prev];

      updated[selectedIndex] = {
        ...updated[selectedIndex],
        x: x - moveOffset.x,
        y: y - moveOffset.y,
      };

      return updated;

    });

    return;
  }


  // ==========================
  // Drawing New Rectangle
  // ==========================

  if (!drawing || !currentBox) return;


  setCurrentBox({
    ...currentBox,
    width: x - currentBox.x,
    height: y - currentBox.y
  });

};
  // ==========================
  // Mouse Up
  // ==========================
  const handleMouseUp = () => {

     // Stop Resize

if(resizeHandle){

    saveHistory(annotations);

    setResizeHandle(null);

    return;

}

  // ==========================
// Stop Moving
// ==========================

if (isMoving) {

  saveHistory(annotations);

  setIsMoving(false);

  setMoveOffset(null);

  return;
}


  // ==========================
  // Save New Rectangle
  // ==========================

  if (!currentBox) return;


  setAnnotations(prev => {

  const updated = [
    ...prev,
    currentBox
  ];


  saveHistory(updated);


  return updated;

});


  setCurrentBox(null);

  setDrawing(false);

};
  // ==========================
  // Draw Canvas
  // ==========================
  const drawCanvas = () => {
    if (!width || !height) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0,0,canvas.width,canvas.height);

    // Saved boxes

   annotations.forEach((box, index)=>{

    if(index === selectedIndex){
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 3;
    }
    else{
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
    }

    ctx.strokeRect(
        box.x,
        box.y,
        box.width,
        box.height
    );


    // Draw Resize Handles
    if(index === selectedIndex){

        const handleSize = 8;

        const handles = [
            {
                x: box.x,
                y: box.y,
            },
            {
                x: box.x + box.width,
                y: box.y,
            },
            {
                x: box.x,
                y: box.y + box.height,
            },
            {
                x: box.x + box.width,
                y: box.y + box.height,
            }
        ];


        ctx.fillStyle = "blue";


        handles.forEach(handle => {

            ctx.fillRect(
                handle.x - handleSize / 2,
                handle.y - handleSize / 2,
                handleSize,
                handleSize
            );

        });

    }

});
  

    // Live Preview

    if(currentBox){

        ctx.strokeStyle="lime";

        ctx.lineWidth=2;

        ctx.strokeRect(

            currentBox.x,
            currentBox.y,
            currentBox.width,
            currentBox.height

        );

    }

}

useEffect(() => {

  const handleKeyDown = (e) => {

    if(e.key === "Escape"){

  setSelectedIndex(-1);

  setResizeHandle(null);

  setIsMoving(false);

  return;

}
// ==========================
// Undo Ctrl + Z
// ==========================

if(
  e.ctrlKey &&
  e.key === "z"
){

  e.preventDefault();


  if(historyIndex <= 0){

    console.log("Nothing to Undo");

    return;

  }


  const newIndex = historyIndex - 1;


 setAnnotations(
 JSON.parse(
   JSON.stringify(history[newIndex])
 )
);

  setHistoryIndex(newIndex);


  return;

}


// ==========================
// Redo Ctrl + Y
// ==========================

if(
 e.ctrlKey &&
 e.key === "y"
){

 e.preventDefault();


 if(historyIndex >= history.length - 1){

   console.log("Nothing to Redo");

   return;

 }


 const newIndex = historyIndex + 1;


 setAnnotations(
   history[newIndex]
 );


 setHistoryIndex(newIndex);


 return;

}

// ==========================
// Save Annotation
// ==========================

if(
  e.ctrlKey &&
  e.key === "s"
){

  e.preventDefault();

  localStorage.setItem(
    "annotations",
    JSON.stringify(annotations)
  );

  console.log("Annotations Saved");

  return;

}


// ==========================
// Delete Annotation
// ==========================

if(e.key === "Delete"){

  if(selectedIndex === -1){
    return;
  }


  const updated = annotations.filter(
    (_, index) => index !== selectedIndex
  );


  setAnnotations(updated);


  saveHistory(updated);


  setSelectedIndex(-1);


  return;

}

// Arrow Key Move
// ==========================

if(
  selectedIndex !== -1 &&
  [
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown"
  ].includes(e.key)
){

  setAnnotations(prev => {

    const updated = [...prev];

    const box = {
      ...updated[selectedIndex]
    };


    const step = 2;


    if(e.key === "ArrowLeft"){
      box.x -= step;
    }


    if(e.key === "ArrowRight"){
      box.x += step;
    }


    if(e.key === "ArrowUp"){
      box.y -= step;
    }


    if(e.key === "ArrowDown"){
      box.y += step;
    }


    updated[selectedIndex] = box;


    return updated;

  });


  return;

}

      setAnnotations(prev =>
        prev.filter(
          (_, index) => index !== selectedIndex
        )
      );


      setSelectedIndex(-1);

    }

  window.addEventListener(
    "keydown",
    handleKeyDown
  );


  return () => {

    window.removeEventListener(
      "keydown",
      handleKeyDown
    );

  };


}, [
  selectedIndex,
  annotations,
  history,
  historyIndex
]);

  useEffect(() => {
   drawCanvas();
   }, [annotations, currentBox, selectedIndex]);



  useEffect(() => {
  if (!canvasRef.current) return;

  canvasRef.current.width = width;
  canvasRef.current.height = height;

  drawCanvas();
}, [width, height]);

  return (
    <canvas
  ref={canvasRef}
  width={width}
  height={height}
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
  style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "auto",
    cursor: "crosshair",
    zIndex: 10,
  }}
/>
  );
}

export default AnnotationCanvas;