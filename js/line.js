function lineClick() {
    context.lineCap = "round";

    var starter_x;
    var starter_y;

    canvas.onmousedown = function bb(event) {
        canvas.onmousemove = null;
        starter_x = event.offsetX;
        starter_y = event.offsetY;
    };
    canvas.onmouseup = function bbb(event) {
        canvas.onmousemove = null;
        context.beginPath();
        context.moveTo(starter_x, starter_y);
        context.lineTo(event.offsetX, event.offsetY);
        context.strokeStyle = currentColor;
        context.fillStyle = currentColor;
        context.stroke();
        context.closePath();
    };
    
}
