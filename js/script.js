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

function toggleMenu(menu) {
    menu.classList.toggle("active");
}

function menuItemClick(menuItem) {
    
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
        toggleMenu(menu);
    } else {
        menuClick(menu);
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