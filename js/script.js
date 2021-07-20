"use strict";

let menuBar = document.querySelector(".menuBar");
let menuBtn = document.querySelector(".menu");
let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");
let canvasWidth = 500;
let canvasHeight = 500;
let canvasBackgroundColor = "#ffffff";
let canvasIsTransparent = "false";

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
    if (menuItem.id == "saveImage") {

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
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let buttons = document.querySelectorAll("form > div > button");
    for (let button of buttons) {
        button.addEventListener("click", buttonClick);
    }
})

function showForm(formClass) {
    document.querySelector(".overlay").removeAttribute("hidden");
    let form = document.querySelector(formClass);
    form.classList.add("active");
    setFormValues(form);
}

function closeForm(form) {
    document.querySelector(".overlay").setAttribute("hidden", true);
    document.querySelector(".form.active").classList.remove("active");
}

function setFormValues(form) {
    let inputs = form.querySelectorAll("input");
    inputs[0].value = canvasWidth; //width
    inputs[1].value = canvasHeight; //height
    if (activeForm.classList.contains("imageCreationForm")) {
        inputs[2].value = canvasBackgroundColor; // background color
        inputs[3].checked = canvasIsTransparent; // transparency
    }
}

function inputIsValid() {
    let form = document.querySelector(".form.active");
    let inputs = form.querySelectorAll("input");
    return (inputs[0].validity.valid && inputs[1].validity.valid);
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

