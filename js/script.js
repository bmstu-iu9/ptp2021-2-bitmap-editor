"use strict";

let menuBar = document.querySelector(".menuBar");
let menuBtn = document.querySelector(".menu");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");

let canvasWidth = 500;
let canvasHeight = 500;
let backgroundColor = "transparent";

let workspace = document.querySelector(".workspace");
let canvasArea = document.querySelector(".canvasArea");
let canvasClass = document.querySelector(".canvas");

window.addEventListener("load", () => {
    resizeCanvasArea();
    centerCanvas();

    let buttons = document.querySelectorAll("form > div > button");
    for (let button of buttons) {
        button.addEventListener("click", buttonClick);
    }
})

/* Убираем зазор между рабочей областью и вкладкой меню "Файл", когда наводим на нее */
menuBtn.addEventListener("mouseover", () => {
    document.querySelector(".workspace").classList.add("topLeftCorner");
})

menuBtn.addEventListener("mouseout", () => {
    document.querySelector(".workspace").classList.remove("topLeftCorner");
})

/* Меню */

function removeMenuEvents() {
    document.removeEventListener("mousedown", closeMenu);
    menuBar.removeEventListener("mouseover", menuHover);
}

function addMenuEvents() {
    document.addEventListener("mousedown", closeMenu);
    menuBar.addEventListener("mouseover", menuHover);
}

function toggleMenu(menu) {
    menu.classList.toggle("active");
}

function menuItemClick(menuItem) {
    if (menuItem.id != "openImage" && menuItem.id != "insertImage") {
        toggleMenu(menuItem.closest(".menu"));
    }
    switch (menuItem.id) {
        case "createImage":
            showForm(".imageCreationForm");
            break;
        case "saveImage":
            saveImage();
            break;
        case "resizeImage":
            showForm(".imageResizeForm");
            break;
        case "resizeCanvas":
            showForm(".canvasResizeForm");
            break;
    }
}

function menuClick(menu) {
    if (menu.classList.contains("active")) {
        removeMenuEvents();
    } else {
        addMenuEvents();
    }
    toggleMenu(menu);
}

menuBar.addEventListener("mousedown", menuBarClick);

function menuBarClick() {
    event.preventDefault();
    event.stopPropagation();

    let target = event.target;
    let menu = target.closest(".menu");
    if (target.classList == "hotkey") {
        removeMenuEvents();
        menuItemClick(target.closest(".menuItem"));
    } else if (target.classList == "menuItem") {
        removeMenuEvents();
        menuItemClick(target);
    } else {
        menuClick(menu);
    }
}

function menuHover() {
    let target = event.target.closest(".menu");
    let activeMenu = document.querySelector(".menu.active");
    if (activeMenu != target) {
        toggleMenu(activeMenu);
        toggleMenu(target);
    }
}

function closeMenu() {
    /* Закрываем вкладку меню по клику вне строки меню */
    toggleMenu(document.querySelector(".menu.active"));
    removeMenuEvents();
}

/* Формы */

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
    document.addEventListener("keydown", formKeyDown);
    form.classList.add("active");
}

function formKeyDown() {
    if (event.key == "Enter") {
        let form = document.querySelector(".form.active");
        form.querySelectorAll("button")[1].click();
        if (form.classList.contains("imageCreationForm")) {
            form.querySelector("input[type=color]").blur();
        }
    } else if (event.key == "Escape") {
        document.querySelector(".form.active").querySelectorAll("button")[0].click();
    }
}

function closeForm() {
    document.querySelector(".overlay").setAttribute("hidden", true);
    document.querySelector(".form.active").classList.remove("active");
    document.removeEventListener("keydown", formKeyDown);
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
            break;
        case "createImage":
            if (inputIsValid()) {
                closeForm();
                createNewImage();
            };
            break;
        case "resizeImage":
            if (inputIsValid()) {
                closeForm();
                resizeImage();
            };
            break;
        case "resizeCanvas":
            if (inputIsValid()) {
                closeForm();
                resizeCanvas();
            };
            break;
    }
}

/* взаимодействие с холстом */

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
    resizeCanvasArea();
    centerCanvas();
}


/* костыль, судя по всему */
document.querySelector("#openImage").addEventListener("mouseup", () => {
    document.querySelector(".menu").classList.remove("active");
});

document.querySelector("#openImage").addEventListener("change", () => {
    let file = event.target.files[0];
    if (file) {
        openImage(file);
    }
});

function openImage(file) {
    clearCanvas();
    let reader = new FileReader();
    let image = new Image();
    image.onload = function () {
        setCanvasValues(image.width, image.height, "transparent");
        context.drawImage(image, 0, 0);
        resizeCanvasArea();
        centerCanvas();
    }
    reader.onload = function () {
        image.src = reader.result;
    }
    reader.readAsDataURL(file);
    document.querySelector("input[name=openImage]").value = null;
}

function resizeCanvasArea() {
    let width = canvasWidth * 2;
    let height = canvasHeight * 2;
    canvasArea.style.width = width + "px";
    canvasArea.style.height = height + "px";
}

function centerCanvas() {
    canvasClass.style.top = "0px";
    canvasClass.style.right = "0px";
    canvasClass.style.bottom = "0px";
    canvasClass.style.left = "0px";
    canvasClass.style.margin = "auto";

    canvas.scrollIntoView();
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
    resizeCanvasArea();
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
    resizeCanvasArea();
    centerCanvas();
}

function saveImage() {
    const link = document.createElement("a");
    link.download = 'image.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
}

document.addEventListener("keydown", hotkeyPress);

function hotkeyPress() {
    if (event.altKey) {
        switch (event.key) {
            case "n":
                showForm(".imageCreationForm");
                break;
            case "o":
                document.querySelector("input[name=openImage]").click();
                break;
            case "s":
                saveImage();
                break;
            case "t":
                showForm(".imageResizeForm");
                break;
            case "y":
                showForm(".canvasResizeForm");
                break;
        }
    }
}
