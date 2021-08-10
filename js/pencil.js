//"use strict";

//let canvas = document.querySelector("#canvas");
//let context = canvas.getContext("2d"); <- уже объявлено в script.js

function pencilClick() {

    context.lineCap = "round"; // скругленные концы линий
    context.lineWidth = 2; //ширина
 
    // любое движение мышки по canvas вызывает эту функцию
    canvas.onmousemove = function drawing(event) {
      // в "e"  попадает экземпляр MouseEvent
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
}