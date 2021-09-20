function pencilClick() {
    context.lineCap = "round";

    canvas.onmousedown = function (event) {
        dotDraw(event);
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
                if (event.which == 1) {
                    context.strokeStyle = currentColor;
                    context.fillStyle = currentColor;
                }
                if (event.which == 3) {
                    context.strokeStyle = currentColor2;
                    context.fillStyle = currentColor2;
                }
                context.stroke();
                context.closePath();
                //для undo
                restore_array.push(context.getImageData(0, 0, canvasWidth, canvasHeight));
                index += 1;
            }
        }
    };

    canvas.onmouseup = function () {
        canvas.onmousemove = null;
    };
}

function dotDraw(event) {
    context.fillRect(event.offsetX,event.offsetY,1,1);
}