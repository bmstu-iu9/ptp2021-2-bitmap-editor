function brushClick() {
    context.lineCap = "round";
    var currentOpacity = context.globalAlpha;
    var pointer, points;
    points = new Array(10);
    canvas.onmousedown = function(event) {

        context.globalAlpha = 0.1;
        pointer = 0;

        canvas.onmousemove = function drawing(event) {
            // в "event"  попадает экземпляр MouseEvent
            var x = event.offsetX;
            var y = event.offsetY;

            points[0] = [x, y];
            var nextpoint = pointer + 1;
            if (nextpoint > 9) {
                nextpoint = 0;
            }

            if (event.buttons > 0) {
                context.beginPath();
                context.moveTo(points[pointer][0], points[pointer][1]);
                context.lineTo(x, y);
                if (points[nextpoint]) {
                    context.moveTo(
                        points[nextpoint][0] + Math.round(Math.random() * 10 - 5),
                        points[nextpoint][1] + Math.round(Math.random() * 10 - 5)
                    );
                    context.lineTo(x, y);
                }
                if (event.which == 1) {
                    context.strokeStyle = currentColor;
                    context.fillStyle = currentColor;
                }
                if (event.which == 3) {
                    context.strokeStyle = currentColor2;
                    context.fillStyle = currentColor2;
                }
                context.stroke();
                pointer = nextpoint;
                points[pointer] = [x, y];
                //для undo
                restore_array.push(context.getImageData(0, 0, canvasWidth, canvasHeight));
                index += 1;
            }
        }
    };

    canvas.onmouseup = function() {
        context.globalAlpha = currentOpacity;
        points = new Array(10);
        canvas.onmousemove = null;
    };
}