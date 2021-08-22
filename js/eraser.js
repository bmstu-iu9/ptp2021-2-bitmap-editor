function eraserClick() {

    var mouseIsDown = false;
    context.lineCap = "round";

    context.globalCompositeOperation = "destination-out";
    context.strokeStyle = "rgba(245,245,245,1)";
    context.fillStyle = "rgba(245,245,245,1)";

    canvas.onmousedown = function (event) {
        mouseIsDown = true;
        canvas.onmousemove = function cleaning(event) {
            var x = event.offsetX;
            var y = event.offsetY;
            var xdif = event.movementX;
            var ydif = event.movementY;

            if (event.buttons > 0) {
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(x - xdif, y - ydif);
                context.stroke();
                context.closePath();
            }
        }
        context.globalCompositeOperation = "source-over"; // возвращаем по-умолчанию

    }
    canvas.onmouseup = function (e) {
        if (mouseIsDown) eraserClick(e);

        mouseIsDown = false;
    }
}
