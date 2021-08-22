function pencilClick() {
    context.lineCap = "round";

    canvas.onmousedown = function (event) {

        canvas.onmousemove = function drawing(event) {
            // в "event"  попадает экземпляр MouseEvent
            var x = event.offsetX;
            var y = event.offsetY;
            var xdif = event.movementX;
            var ydif = event.movementY;

            if (event.buttons > 0) {
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(x - xdif, y - ydif);
                context.strokeStyle = currentColor;
                context.fillStyle = currentColor;
                context.stroke();
                context.closePath();
            }
        }
    }

    canvas.onmouseup = function () {
        canvas.onmousemove = null;
    }
}
