function eraserClick() {

    var mouseIsDown = false;
    context.lineCap = "round";

    canvas.onmousedown = function (event) {

        canvas.onmousemove = function cleaning(event) {
            var x = event.offsetX;
            var y = event.offsetY;
            var xdif = event.movementX;
            var ydif = event.movementY;

            if (event.buttons > 0) {
                context.beginPath();
                context.globalCompositeOperation = "destination-out";

                context.moveTo(x, y);
                context.lineTo(x - xdif, y - ydif);
                context.strokeStyle = "rgba(255,255,255,1)";
                context.fillStyle = "rgba(255,255,255,1)";
                context.stroke();
                context.globalCompositeOperation = "source-over"; // возвращаем по-умолчанию
                context.closePath();
            }
        }

        mouseIsDown = true;
    }
    canvas.onmouseup = function (e) {
        if (mouseIsDown) pencilClick(e);

        mouseIsDown = false;
    }
}
