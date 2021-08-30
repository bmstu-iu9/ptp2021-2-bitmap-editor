function brushClick() {
  context.lineCap = "round";
  var currentOpacity = context.globalAlpha;
  var pointer, points, lastPoint, currentPoint;
  points = new Array(10);
  var img = new Image();
  img.src = "icons/brush.png";

  canvas.onmousedown = function (event) {
    pointer = 0;
    lastPoint = { xPoint: event.offsetX, yPoint: event.offsetY };

    canvas.onmousemove = function drawing(event) {
      // в "event"  попадает экземпляр MouseEvent
      var x = event.offsetX;
      var y = event.offsetY;

      if (brushType == 1) {
        //обычная кисть
        context.globalAlpha = 0.1;
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
          context.closePath();
          pointer = nextpoint;
          points[pointer] = [x, y];
          //для undo
          restore_array.push(
            context.getImageData(0, 0, canvasWidth, canvasHeight)
          );
          index += 1;
        }
      }
      if (brushType == 2) {
        //жирная кисть
        currentPoint = { xPoint: event.offsetX, yPoint: event.offsetY };
        var dist = distanceBetween(lastPoint, currentPoint);
        var angle = angleBetween(lastPoint, currentPoint);
        if (event.buttons > 0) {
          context.beginPath();
          for (var i = 0; i < dist; i++) {
            xT = lastPoint.xPoint + Math.sin(angle) * i - 25;
            yT = lastPoint.yPoint + Math.cos(angle) * i - 25;
            context.drawImage(img, xT, yT);
          }
          lastPoint = currentPoint;
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
          /*для undo
          restore_array.push(
            context.getImageData(0, 0, canvasWidth, canvasHeight)
          );
          index += 1;
          */
        }
      }
      if (brushType == 3) {
        //кисть спрей
        if (event.buttons > 0) {
          context.beginPath();
          for (var i = 0; i < 20; i++) {
            var angle = getRandomFloat(0, Math.PI * 2);
            var radius = getRandomFloat(0, 20);
            context.fillRect(
              x + radius * Math.cos(angle),
              y + radius * Math.sin(angle),
              1,
              1
            );
          }
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
        context.closePath();
        /*для undo
          restore_array.push(
            context.getImageData(0, 0, canvasWidth, canvasHeight)
          );
          index += 1;
          */
      }
      if (brushType == 4) {
        //случайные пиксели
        if (event.buttons > 0) {
          context.beginPath();
          for (var i = -10; i < 10; i += 4) {
            for (var j = -10; j < 10; j += 4) {
              if (Math.random() > 0.5) {
                context.fillStyle = [
                  "red",
                  "orange",
                  "yellow",
                  "green",
                  "light-blue",
                  "blue",
                  "purple",
                ][getRandomInt(0, 6)];
                context.fillRect(x + i, y + j, 4, 4);
              }
            }
          }
          context.stroke();
          context.closePath();
          /*для undo
          restore_array.push(
            context.getImageData(0, 0, canvasWidth, canvasHeight)
          );
          index += 1;
          */
        }
      }
    };
  };

  canvas.onmouseup = function () {
    context.globalAlpha = currentOpacity;
    points = new Array(10);
    canvas.onmousemove = null;
  };

  function distanceBetween(point1, point2) {
    return Math.sqrt(
      Math.pow(point2.xPoint - point1.xPoint, 2) +
        Math.pow(point2.yPoint - point1.yPoint, 2)
    );
  }
  function angleBetween(point1, point2) {
    return Math.atan2(
      point2.xPoint - point1.xPoint,
      point2.yPoint - point1.yPoint
    );
  }
  function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
