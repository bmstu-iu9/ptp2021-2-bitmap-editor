function circleClick() {
    context.lineCap = "round";
    
    var starter_x;
    var starter_y;
    canvas.onmousedown = function bb(event) {
        starter_x = event.offsetX;
        starter_y = event.offsetY;
        let radius;
    
        let buf = context.getImageData(0, 0, canvasWidth, canvasHeight)
        canvas.onmousemove = function bbb(event) {
        
            context.putImageData(buf, 0, 0)
            buf = context.getImageData(0, 0, canvasWidth, canvasHeight)
            context.beginPath();
            radius = Math.sqrt(Math.pow(event.offsetX - starter_x, 2) + Math.pow(event.offsetY - starter_y, 2));
            context.arc(starter_x, starter_y, radius, 0, 2 * Math.PI, false);
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
        };
    };

    canvas.onmouseup = function bb(event) {
        canvas.onmousemove = null;
    };
}
