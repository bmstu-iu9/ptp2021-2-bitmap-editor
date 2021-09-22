function circleClick(e) {
let radius;

function initCircle() {
  canvas.style.cursor = 'crosshair';
  canvas.addEventListener('mousedown', startPointCircle);
}

function deleteCircle() {
  canvas.style.cursor = 'default';
  canvas.removeEventListener('mousedown', startPointCircle);
  document.removeEventListener('mousemove', drawCircle);
  document.removeEventListener('mouseup', endPoint);
}

function startPointCircle(e) {
  initFigure(e);

  drawCircle(e);

  document.addEventListener('mousemove', drawCircle);
  document.addEventListener('mouseup', endPoint);
}

function drawCircle(e) {
  if (!isDrawing) return;

  updateCanvasFigures(e);

  radius = Math.sqrt(Math.pow(curX - oldX, 2) + Math.pow(curY - oldY, 2));
  context.arc(oldX, oldY, radius, 0, 2 * Math.PI, false);
  context.stroke();

  if (isThereSelection) uniteRememberAndSelectedImages();
  changePreview();
}
}