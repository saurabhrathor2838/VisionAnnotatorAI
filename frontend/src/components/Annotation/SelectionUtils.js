export function getAnnotationAtPoint(annotations, x, y) {
  for (let i = annotations.length - 1; i >= 0; i--) {
    const box = annotations[i];

    const left = Math.min(box.x, box.x + box.width);
    const right = Math.max(box.x, box.x + box.width);
    const top = Math.min(box.y, box.y + box.height);
    const bottom = Math.max(box.y, box.y + box.height);

    if (
      x >= left &&
      x <= right &&
      y >= top &&
      y <= bottom
    ) {
      return i;
    }
  }

  return -1;
}