function squareClick() {
    context.lineCap = "round";

    var starter_x;
    var starter_y;

    canvas.onmousedown = function bb(event) {
        starter_x = event.offsetX;
        starter_y = event.offsetY;
        let buf = context.getImageData(0, 0, canvasWidth, canvasHeight)
        canvas.onmousemove = function bbb(event) {
            context.putImageData(buf, 0, 0)
            buf = context.getImageData(0, 0, canvasWidth, canvasHeight)
            context.beginPath();
       
            if (event.which == 1) {
                context.strokeStyle = currentColor;
                context.fillStyle = currentColor;
            }
            if (event.which == 3) {
                context.strokeStyle = currentColor2;
                context.fillStyle = currentColor2;
            }
            context.strokeRect(starter_x, starter_y, event.offsetX - starter_x, event.offsetY - starter_y);
            context.closePath();
            //для undo
            restore_array.push(context.getImageData(0, 0, canvasWidth, canvasHeight));
            index += 1;
        };
    };

    canvas.onmouseup = function bb(event) {
        canvas.onmousemove = null;
    };
}