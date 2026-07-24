import React, { createContext, useContext, useState } from "react";

const AnnotationContext = createContext();

export function AnnotationProvider({ children }) {
  const [annotations, setAnnotations] = useState([]);
  const [selectedAnnotationId, setSelectedAnnotationId] = useState(null);

  return (
    <AnnotationContext.Provider
      value={{
        annotations,
        setAnnotations,
        selectedAnnotationId,
        setSelectedAnnotationId,
      }}
    >
      {children}
    </AnnotationContext.Provider>
  );
}

export function useAnnotation() {
  return useContext(AnnotationContext);
}