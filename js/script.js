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
    document.querySelector("button[name=insertImage]").addEventListener("click", insertImageButtonClick);
    document.querySelector("button[name=cancelImageInsertion]").addEventListener("click", cancelImageInsertionClick);
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

/* Поместить изображение на холст */

document.querySelector("#insertImage").addEventListener("mouseup", () => {
    document.querySelector(".menu").classList.remove("active");
});

document.querySelector("#insertImage").addEventListener("change", () => {
    let file = event.target.files[0];
    if (file) {
        openImageToInsert(file);
    }
});

function openImageToInsert(file) {
    let reader = new FileReader();
    let image = new Image();
    image.onload = function () {
        initImageInsertion(image);
    }
    reader.onload = function () {
        image.src = reader.result;
    }
    reader.readAsDataURL(file);
    document.querySelector("input[name=insertImage]").value = null;
}

let containerState = {
        minWidth: 10,
        minHeight: 10,
        img: new Image(),
    },
    container, containerAngle, angle;

function initImageInsertion(image) {
    container = document.createElement("div");
    container.classList = "selectionContainer";
    canvasArea.append(container);

    containerState.img.src = image.src;
    container.insertAdjacentHTML("afterbegin", "<img src='" + image.src + "' id='selectedImage'>")

    container.insertAdjacentHTML("afterbegin", "<span class='selectionHandle N'></span>")
    container.insertAdjacentHTML("afterbegin", "<span class='selectionHandle E'></span>")
    container.insertAdjacentHTML("afterbegin", "<span class='selectionHandle W'></span>")
    container.insertAdjacentHTML("afterbegin", "<span class='selectionHandle NE'></span>")
    container.insertAdjacentHTML("afterbegin", "<span class='selectionHandle NW'></span>")
    container.insertAdjacentHTML("beforeend", "<span class='selectionHandle SE'></span>")
    container.insertAdjacentHTML("beforeend", "<span class='selectionHandle SW'></span>")
    container.insertAdjacentHTML("beforeend", "<span class='selectionHandle S'></span>")
    container.insertAdjacentHTML("beforeend", "<span class='rotationHandle'></span>")

    container.style.top = "50%";
    container.style.left = "50%";

    let handles = container.querySelectorAll(".selectionHandle");
    for (let handle of handles) {
        handle.addEventListener("mousedown", startResize);
    }
    //container.querySelector(".rotationHandle").addEventListener("mousedown", startRotation);

    removeDocumentEvents();

    document.querySelector("#selectedImage").addEventListener("mousedown", startMoving);
    document.addEventListener("keydown", imageInsertionKeyPress);

    containerAngle = 0;

    document.querySelector(".palette").setAttribute("hidden", true);
    document.querySelector(".insertImageButtons").removeAttribute("hidden");
}

function removeDocumentEvents() {
    document.removeEventListener("keydown", hotkeyPress);
    menuBar.removeEventListener("mousedown", menuBarClick);
}

function returnDocumentEvents() {
    document.addEventListener("keydown", hotkeyPress);
    menuBar.addEventListener("mousedown", menuBarClick);
}

function insertImage() {
    //saveContainerState()
    let image = document.querySelector("#selectedImage");
    let x = container.offsetLeft - canvas.offsetLeft;
    let y = container.offsetTop - canvas.offsetTop;
    /*let centerX = containerState.left + containerState.width / 2;
    let centerY = containerState.top + containerState.height / 2;
    context.save();
    context.translate(x + containerState.width / 2, y + containerState.height / 2);
    context.rotate(containerAngle);
    context.drawImage(image, -containerState.width / 2, -containerState.height / 2, image.width, image.height);*/
    context.drawImage(image, x, y, image.width, image.height);
    //context.restore();
}

function insertImageButtonClick() {
    insertImage();
    returnDocumentEvents();
    container.remove();
    document.removeEventListener("keydown", imageInsertionKeyPress);
    document.querySelector(".palette").removeAttribute("hidden");
    document.querySelector(".insertImageButtons").setAttribute("hidden", true);
}

function cancelImageInsertionClick() {
    returnDocumentEvents();
    container.remove();
    document.removeEventListener("keydown", imageInsertionKeyPress);
    document.querySelector(".palette").removeAttribute("hidden");
    document.querySelector(".insertImageButtons").setAttribute("hidden", true);
}

function imageInsertionKeyPress() {
    event.preventDefault();
    event.stopPropagation();
    switch (event.key) {
        case "Enter":
            insertImageButtonClick();
            break;
        case "Escape":
            cancelImageInsertionClick();
            break;
        case "ArrowUp":
            container.style.top = container.offsetTop - 1 + "px";
            break;
        case "ArrowRight":
            container.style.left = container.offsetLeft + 1 + "px";
            break;
        case "ArrowDown":
            container.style.top = container.offsetTop + 1 + "px";
            break;
        case "ArrowLeft":
            container.style.left = container.offsetLeft - 1 + "px";
            break;
    }
}

function startResize() {
    event.preventDefault();
    event.stopPropagation();
    saveContainerState();
    document.addEventListener("mousemove", resizing);
    document.addEventListener("mouseup", endResize);
}

function endResize() {
    event.preventDefault();
    document.removeEventListener("mousemove", resizing);
    document.removeEventListener("mouseup", endResize);
}

function saveContainerState() {
    containerState.width = container.clientWidth;
    containerState.height = container.clientHeight;
    containerState.left = container.offsetLeft;
    containerState.top = container.offsetTop;
    containerState.mouseX = event.clientX + workspace.scrollLeft;
    containerState.mouseY = event.clientY + workspace.scrollTop;
    containerState.event = event;
}

function resizing() {
    let mouseX = event.clientX + workspace.scrollLeft - workspace.offsetLeft;
    let mouseY = event.clientY + workspace.scrollTop - workspace.offsetTop;

    let width, height, left, top;

    let handleClassList = containerState.event.target.classList;

    if (handleClassList.contains("SE")) {
        width = mouseX - containerState.left;
        if (event.shiftKey) {
            height = width * containerState.img.height / containerState.img.width;
        } else {
            height = mouseY - containerState.top;
        }
        left = containerState.left;
        top = containerState.top;

    } else if (handleClassList.contains("SW")) {
        width = containerState.width + containerState.left - mouseX;
        if (event.shiftKey) {
            height = width * containerState.img.height / containerState.img.width;
        } else {
            height = mouseY - containerState.top;
        }
        left = mouseX;
        top = containerState.top;

    } else if (handleClassList.contains("NW")) {
        width = containerState.width + containerState.left - mouseX;
        left = mouseX;
        if (event.shiftKey) {
            height = width * containerState.img.height / containerState.img.width;
            top = containerState.top + containerState.height - height;
        } else {
            height = containerState.height + containerState.top - mouseY;
            top = mouseY;
        }

    } else if (handleClassList.contains("NE")) {
        width = mouseX - containerState.left;
        left = container.offsetLeft;
        if (event.shiftKey) {
            height = width * containerState.img.height / containerState.img.width;
            top = containerState.top + containerState.height - height;
        } else {
            height = containerState.height + containerState.top - mouseY;
            top = mouseY;
        }
    } else if (handleClassList.contains("N")) {
        height = containerState.height + containerState.top - mouseY;
        top = mouseY;
        if (event.shiftKey) {
            width = height * containerState.img.width / containerState.img.height;
            left = containerState.left - (width - containerState.width) / 2;
        } else {
            width = container.clientWidth;
            left = container.offsetLeft;
        }

    } else if (handleClassList.contains("E")) {
        width = mouseX - containerState.left;
        left = container.offsetLeft;
        if (event.shiftKey) {
            height = width * containerState.img.height / containerState.img.width;
            top = containerState.top - (height - containerState.height) / 2;
        } else {
            height = container.clientHeight;
            top = container.offsetTop;
        }

    } else if (handleClassList.contains("S")) {
        height = mouseY - containerState.top;
        top = container.offsetTop;
        if (event.shiftKey) {
            width = height * containerState.img.width / containerState.img.height;
            left = containerState.left - (width - containerState.width) / 2;
        } else {
            width = container.clientWidth;
            left = container.offsetLeft;
        }

    } else if (handleClassList.contains("W")) {
        width = containerState.width - (mouseX - containerState.left);
        left = mouseX;
        if (event.shiftKey) {
            height = width * containerState.img.height / containerState.img.width;
            top = containerState.top - (height - containerState.height) / 2;
        } else {
            height = container.clientHeight;
            top = container.offsetTop;
        }
    }

    if (width > containerState.minWidth && height > containerState.minHeight) {
        resizeSelectedImage(width, height);
        container.style.top = top + "px";
        container.style.left = left + "px";
    }
}

function resizeSelectedImage(width, height) {
    let image = document.querySelector("#selectedImage");
    image.style.width = width + "px";
    image.style.height = height + "px";
}

function startMoving() {
    event.preventDefault();
    event.stopPropagation();
    saveContainerState();
    document.addEventListener("mousemove", moving);
    document.addEventListener("mouseup", endMoving);
}

function endMoving() {
    event.preventDefault();
    document.removeEventListener("mouseup", endMoving);
    document.removeEventListener("mousemove", moving);
}

function moving() {
    let mouseX = event.clientX + workspace.scrollLeft;
    let mouseY = event.clientY + workspace.scrollTop;

    container.style.left = containerState.left + mouseX - containerState.mouseX + "px";
    container.style.top = containerState.top + mouseY - containerState.mouseY + "px";
}
