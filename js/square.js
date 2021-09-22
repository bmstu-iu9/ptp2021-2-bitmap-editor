function squareClick(e) {
  if (!isDrawing) return;

  updateCanvasFigures(e);

  context.strokeRect(oldX, oldY, curX - oldX, curY - oldY);

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}