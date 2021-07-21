"use strict";

let menuBar = document.querySelector(".menuBar");
let menuBtn = document.querySelector(".menu");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");

let canvasWidth = 500;
let canvasHeight = 500;
let backgroundColor = "transparent";

let workspace = document.querySelector(".workspace");
let canvasClass = document.querySelector(".canvas");

/* Убираем зазор между рабочей областью и вкладкой меню "Файл", когда наводим на нее */
menuBtn.addEventListener("mouseover", () => {
    document.querySelector(".workspace").classList.add("topLeftCorner");
})

menuBtn.addEventListener("mouseout", () => {
    document.querySelector(".workspace").classList.remove("topLeftCorner");
})

/* Меню */

function toggleMenu(menu) {
    menu.classList.toggle("active");
}

function menuItemClick(menuItem) {
    toggleMenu(menuItem.closest(".menu"));
    if (menuItem.id == "createImage") {
        showForm(".imageCreationForm");
    }
    if (menuItem.id == "openImage") {
        toggleMenu(menuItem.closest(".menu"));
    }
    if (menuItem.id == "saveImage") {
        saveImage();
    }
    if (menuItem.id == "imageSize") {
        showForm(".imageResizeForm");
    }
    if (menuItem.id == "canvasSize") {
        showForm(".canvasResizeForm");
    }
}

function menuClick(menu) {
    let activeMenu = document.querySelector(".menu.active");
    if (activeMenu != null && activeMenu != menu) {
        toggleMenu(activeMenu);
    }
    toggleMenu(menu);
}

menuBar.addEventListener("click", () => {
    let target = event.target;
    let menu = target.closest(".menu");
    if (target.classList == "menuItem") {
        menuItemClick(target);
    } else {
        menuClick(menu);
    }
})

menuBar.addEventListener("mouseover", () => {
    let target = event.target.closest(".menu");
    let activeMenu = document.querySelector(".menu.active");
    if (activeMenu != null && activeMenu != target) {
        toggleMenu(activeMenu);
        toggleMenu(target);
    }
})

document.addEventListener("click", () => {
    let target = event.target;

    /* Закрываем вкладку меню по клику вне строки меню */
    let isMenuBar = (target == menuBar || menuBar.contains(target));
    let activeMenu = document.querySelector(".menu.active");
    if (!isMenuBar && activeMenu != null) {
        toggleMenu(activeMenu);
    }
})

/* Формы */

window.addEventListener("load", () => {
    let buttons = document.querySelectorAll("form > div > button");
    for (let button of buttons) {
        button.addEventListener("click", buttonClick);
    }
})

function formColorInputClick() {
    document.querySelector("input[name=canvasIsTransparent]").checked = false;
}

function formCheckboxClick() {
    let form = event.target.closest(".form");
    let inputs = form.querySelectorAll("input");
    if (!form.classList.contains("imageCreationForm")) {
        inputs[0].toggleAttribute("disabled");
        inputs[1].toggleAttribute("disabled");
        inputs[3].toggleAttribute("disabled");
    }
}

function showForm(formClass) {
    document.querySelector(".overlay").removeAttribute("hidden");
    let form = document.querySelector(formClass);
    setFormValues(form);
    form.classList.add("active");
}

function closeForm() {
    document.querySelector(".overlay").setAttribute("hidden", true);
    document.querySelector(".form.active").classList.remove("active");
}

function setFormValues(form) {
    let inputs = form.querySelectorAll("input");
    inputs[0].value = canvasWidth; //width
    inputs[1].value = canvasHeight; //height
    if (form.classList.contains("imageCreationForm")) {
        if (backgroundColor == "transparent") {
            inputs[2].value = "#ffffff"; // background color
            inputs[3].checked = true; // transparency
        } else {
            inputs[2].value = backgroundColor; // background color
            inputs[3].checked = false; // transparency
        }
    } else {
        inputs[0].disabled = false;
        inputs[1].disabled = false;
        inputs[2].checked = false; // percentage
        inputs[3].value = 100;
        inputs[3].disabled = true;
    }
}

function inputIsValid() {
    let form = document.querySelector(".form.active");
    let inputs = form.querySelectorAll("input");
    if (form.classList.contains("imageCreationForm")) {
        return (inputs[0].validity.valid && inputs[1].validity.valid);
    } else {
        return (inputs[0].validity.valid && inputs[1].validity.valid && (!inputs[2].checked || inputs[3].validity.valid));
    }
}

function buttonClick() {
    let button = event.target;
    switch (button.name) {
        case "cancel":
            closeForm();
        case "createImage":
            if (inputIsValid()) {
                closeForm();
                createNewImage();
            };
        case "resizeImage":
            if (inputIsValid()) {
                closeForm();
                resizeImage();
            };
        case "resizeCanvas":
            if (inputIsValid()) {
                closeForm();
                resizeCanvas();
            };
    }
}

function setCanvasValues(width, height, bgcolor = backgroundColor) {
    canvasWidth = width;
    canvasHeight = height;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    backgroundColor = bgcolor;
}

function clearCanvas() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
}

function createNewImage() {
    clearCanvas();
    let form = document.querySelector(".imageCreationForm");
    let inputs = form.querySelectorAll("input");
    if (inputs[3].checked) {
        setCanvasValues(inputs[0].value, inputs[1].value, "transparent");
    } else {
        setCanvasValues(inputs[0].value, inputs[1].value, inputs[2].value);
    }

    if (backgroundColor != "transparent") {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvasWidth, canvasHeight);
    }
    centerCanvas()
}

document.querySelector("#openImage").addEventListener("change", handleImage, false);

function handleImage(event) {
    clearCanvas();
    let reader = new FileReader();
    let file = event.target.files[0];
    let image = new Image();
    image.onload = function () {
        setCanvasValues(image.width, image.height, "transparent");
        context.drawImage(image, 0, 0);
        centerCanvas();
    }
    reader.onloadend = function () {
        image.src = reader.result;
    }
    reader.readAsDataURL(file);
}

function centerCanvas() {
    canvasClass.style.top = "0px";
    canvasClass.style.right = "0px";
    canvasClass.style.bottom = "0px";
    canvasClass.style.left = "0px";
    canvasClass.style.margin = "auto";
}

function resizeImage() {
    let tempCanvas = document.createElement("canvas");
    let tempContext = tempCanvas.getContext("2d");
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    tempContext.drawImage(canvas, 0, 0);

    let form = document.querySelector(".imageResizeForm");
    let inputs = form.querySelectorAll("input");
    if (inputs[2].checked == true) {
        setCanvasValues(inputs[0].value * inputs[3].value / 100, inputs[1].value * inputs[3].value / 100);
    } else {
        setCanvasValues(inputs[0].value, inputs[1].value);
    }
    context.drawImage(tempCanvas, 0, 0, canvasWidth, canvasHeight);
    centerCanvas();
}

function resizeCanvas() {
    let imgData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    let form = document.querySelector(".canvasResizeForm");
    let inputs = form.querySelectorAll("input");
    if (inputs[2].checked == true) {
        setCanvasValues(inputs[0].value * inputs[3].value / 100, inputs[1].value * inputs[3].value / 100);
    } else {
        setCanvasValues(inputs[0].value, inputs[1].value);
    }
    context.putImageData(imgData, 0, 0);
    centerCanvas();
}

function saveImage() {
    const link = document.createElement("a");
    link.download = 'image.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
}
