function lineClick() {
  context.lineCap = "round";
  context.lineWidth = 2;

  var starter_x;
  var starter_y;

  canvas.onmousedown = function bb(event) {
    starter_x = event.offsetX;
    starter_y = event.offsetY;
  };
  canvas.onmouseup = function bbb(event) {
    context.beginPath();
    context.moveTo(starter_x, starter_y);
    context.lineTo(event.offsetX, event.offsetY);
    context.stroke();
    context.closePath();
  };
}
