export function saveAnnotations(annotations) {
  try {
    localStorage.setItem(
      "vision_annotations",
      JSON.stringify(annotations)
    );
  } catch (error) {
    console.error(
      "Failed to save annotations:",
      error
    );
  }
}


export function loadAnnotations() {
  try {
    const data = localStorage.getItem(
      "vision_annotations"
    );

    if (!data) {
      return [];
    }

    return JSON.parse(data);

  } catch (error) {
    console.error(
      "Failed to load annotations:",
      error
    );

    return [];
  }
}