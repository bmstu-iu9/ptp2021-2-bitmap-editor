function eraserClick() {
    context.lineCap = "round";
    context.globalCompositeOperation = "destination-out";
    var eraserColor = "rgba(245,245,245,1)"
    context.strokeStyle = eraserColor;
    context.fillStyle = eraserColor;

    canvas.onmousedown = function (event) {
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
                //для undo
                restore_array.push(context.getImageData(0, 0, canvasWidth, canvasHeight));
                index += 1;
            }
        }
        context.globalCompositeOperation = "source-over"; // возвращаем по-умолчанию
    }

    canvas.onmouseup = function () {
        canvas.onmousemove = null;
    }

}
