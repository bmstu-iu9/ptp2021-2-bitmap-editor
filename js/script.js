"use strict";

let menuBar = document.querySelector(".menuBar");
let firstMenuBtn = document.querySelector(".menu");
let toolPanel = document.querySelector(".toolPanel");
let firstToolBtn = toolPanel.querySelector(".button");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");

let canvasWidth = 500;
let canvasHeight = 500;
let backgroundColor = "transparent";

let workspace = document.querySelector(".workspace");
let canvasArea = document.querySelector(".canvasArea");
let canvasClass = document.querySelector(".canvas");
let alertShown = false;

window.addEventListener("load", () => {
    resizeCanvasArea();
    centerCanvas();

    let buttons = document.querySelectorAll("form > div > button");
    for (let button of buttons) {
        button.addEventListener("click", buttonClick);
    }
    document.querySelector("button[name=insertImage]").addEventListener("click", insertImageButtonClick);
    document.querySelector("button[name=cancelImageInsertion]").addEventListener("click", cancelImageInsertionClick);
    document.querySelector("button[name=flipHorizontally]").addEventListener("click", flipContainerHorizontally);
    document.querySelector("button[name=flipVertically]").addEventListener("click", flipContainerVertically);
    document.querySelector("button[name=rotateLeft]").addEventListener("click", rotateLeft);
    document.querySelector("button[name=rotateRight]").addEventListener("click", rotateRight);

    firstToolBtn.classList.add("active");
    firstToolBtn.onmouseover = addWorkspaceCorner;
    firstMenuBtn.onmouseover = addWorkspaceCorner;
    firstToolBtn.onmouseout = function () {
        if (!firstToolBtn.classList.contains("active")) {
            removeWorkspaceCorner();
        }
    }
    firstMenuBtn.onmouseout = function () {
        if (!firstToolBtn.classList.contains("active")) {
            removeWorkspaceCorner();
        }
    }
})

function addWorkspaceCorner() {
    workspace.classList.add("topLeftCorner");
}

function removeWorkspaceCorner() {
    workspace.classList.remove("topLeftCorner");
}


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
        case "undo":
            undo_last();
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

/* Взаимодействие с холстом */

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

var brushType = 1; //обозначение типа кисти цифрой

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
            case "1":
                setBrushType(1);
                document.getElementById('bruhsh').style = 'background-image: url(icons/left-panel-tools/brush.svg)'
                break;
            case "2":
                setBrushType(2);
                document.getElementById('bruhsh').style = 'background-image: url(icons/left-panel-tools/brush2.svg)'
                break;
            case "3":
                setBrushType(3);
                document.getElementById('bruhsh').style = 'background-image: url(icons/left-panel-tools/brush3.svg)'
                break;
            case "4":
                setBrushType(4);
                document.getElementById('bruhsh').style = 'background-image: url(icons/left-panel-tools/brush4.png)'
                break;
        }
    }
}

function setBrushType(numType) {
    brushType = numType;
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
        initImageSelection(image);
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
        scaleX: 1,
        scaleY: 1,
    },
    container, containerWrapper, containerAngle, angle;

function initHandles() {
    container.insertAdjacentHTML("afterbegin", "<span class='selectionHandle N top'></span>")
    container.insertAdjacentHTML("afterbegin", "<span class='selectionHandle E right'></span>")
    container.insertAdjacentHTML("afterbegin", "<span class='selectionHandle W left'></span>")
    container.insertAdjacentHTML("afterbegin", "<span class='selectionHandle NE top right'></span>")
    container.insertAdjacentHTML("afterbegin", "<span class='selectionHandle NW top left'></span>")
    container.insertAdjacentHTML("afterbegin", "<span class='rotationHandle N'></span>")
    container.insertAdjacentHTML("afterbegin", "<span class='rotationHandle E'></span>")
    container.insertAdjacentHTML("afterbegin", "<span class='rotationHandle W'></span>")
    container.insertAdjacentHTML("afterbegin", "<span class='rotationHandle NE'></span>")
    container.insertAdjacentHTML("afterbegin", "<span class='rotationHandle NW'></span>")
    container.insertAdjacentHTML("beforeend", "<span class='selectionHandle SE bottom right'></span>")
    container.insertAdjacentHTML("beforeend", "<span class='selectionHandle SW bottom left'></span>")
    container.insertAdjacentHTML("beforeend", "<span class='selectionHandle S bottom'></span>")
    container.insertAdjacentHTML("beforeend", "<span class='rotationHandle SE'></span>")
    container.insertAdjacentHTML("beforeend", "<span class='rotationHandle SW'></span>")
    container.insertAdjacentHTML("beforeend", "<span class='rotationHandle S'></span>")
}

function initImageSelection(image) {
    containerWrapper = document.createElement("div");
    containerWrapper.classList = "selectionWrapper";
    container = document.createElement("div");
    container.classList = "selectionContainer";
    canvasArea.append(containerWrapper);
    containerWrapper.append(container);

    containerState.img.src = image.src;
    container.insertAdjacentHTML("afterbegin", "<img src='" + image.src + "' id='selectedImage'>")

    initHandles();

    let handles = container.querySelectorAll(".selectionHandle");
    for (let handle of handles) {
        handle.addEventListener("mousedown", startResize);
    }
    handles = container.querySelectorAll(".rotationHandle");
    for (let handle of handles) {
        handle.addEventListener("mousedown", startRotation);
    }

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
    toolPanel.removeEventListener("mousedown", toolPanelClick);
}

function returnDocumentEvents() {
    document.addEventListener("keydown", hotkeyPress);
    menuBar.addEventListener("mousedown", menuBarClick);
    toolPanel.addEventListener("mousedown", toolPanelClick);
}

function insertImage() {
    saveContainerState()
    let image = document.querySelector("#selectedImage");

    let x = containerState.left - containerState.width / 2 - canvas.offsetLeft;
    let y = containerState.top - containerState.height / 2 - canvas.offsetTop;
    let centerX = containerState.left - containerState.width / 2 + containerState.width / 2;
    let centerY = containerState.top - containerState.height / 2 + containerState.height / 2;
    context.save();
    context.translate(x + containerState.width / 2, y + containerState.height / 2);
    context.rotate(containerAngle);
    context.scale(containerState.scaleX, containerState.scaleY);
    context.drawImage(image, -containerState.width / 2, -containerState.height / 2, image.width, image.height);
    context.restore();
}

function insertImageButtonClick() {
    insertImage();
    returnDocumentEvents();
    containerWrapper.remove();
    document.removeEventListener("keydown", imageInsertionKeyPress);
    document.querySelector(".palette").removeAttribute("hidden");
    document.querySelector(".insertImageButtons").setAttribute("hidden", true);
}

function cancelImageInsertionClick() {
    returnDocumentEvents();
    containerWrapper.remove();
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
    containerState.width = containerWrapper.clientWidth;
    containerState.height = containerWrapper.clientHeight;
    containerState.left = containerWrapper.offsetLeft;
    containerState.top = containerWrapper.offsetTop;
    containerState.mouseX = event.clientX + workspace.scrollLeft;
    containerState.mouseY = event.clientY + workspace.scrollTop;
    containerState.event = event;
}

function resizing() {
    let width = containerState.width,
        height = containerState.height,
        angle = (containerAngle > 0 ? containerAngle : containerAngle + 2 * Math.PI),
        mouseX = event.clientX + workspace.scrollLeft,
        mouseY = event.clientY + workspace.scrollTop,
        cos = Math.cos(angle),
        sin = Math.sin(angle),
        handleClassList = containerState.event.target.classList,
        dx = mouseX - containerState.mouseX,
        dy = mouseY - containerState.mouseY,
        rdx = cos * dx + sin * dy,
        rdy = -sin * dx + cos * dy,
        top = containerState.top,
        left = containerState.left;

    if (handleClassList.contains("right")) {
        width = containerState.width + rdx;
        if (width < containerState.minWidth) {
            width = containerState.minWidth;
            rdx = containerState.minWidth - containerState.width;
        }
    } else if (handleClassList.contains("left")) {
        width = containerState.width - rdx;
        if (width < containerState.minWidth) {
            width = containerState.minWidth;
            rdx = containerState.width - containerState.minWidth;
        }
    }
    if (handleClassList.contains("top")) {
        height = containerState.height - rdy;
        if (height < containerState.minHeight) {
            height = containerState.minHeight;
            rdy = containerState.height - containerState.minHeight;
        }
    } else if (handleClassList.contains("bottom")) {
        height = containerState.height + rdy;
        if (height < containerState.minHeight) {
            height = containerState.minHeight;
            rdy = containerState.minHeight - containerState.height;
        }
    }

    if (event.shiftKey) {
        if (handleClassList.contains("right") || handleClassList.contains("left")) {
            height = width * containerState.img.height / containerState.img.width;
            if (handleClassList.contains("top")) {
                rdy = containerState.height - height;
            } else if (handleClassList.contains("bottom")) {
                rdy = -containerState.height + height;
            }
        } else if (handleClassList.contains("top") || handleClassList.contains("bottom")) {
            width = height * containerState.img.width / containerState.img.height;
            if (handleClassList.contains("right")) {
                rdx = -containerState.height + height;
            } else if (handleClassList.contains("left")) {
                rdx = containerState.height - height;
            }
        }
    }

    if (handleClassList.contains("right") || handleClassList.contains("left")) {
        left += cos * rdx / 2;
        top += sin * rdx / 2;
    }
    if (handleClassList.contains("top") || handleClassList.contains("bottom")) {
        left -= sin * rdy / 2;
        top += cos * rdy / 2;
    }

    resizeContainer(width, height);
    moveContainer(left, top);
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
    moveContainer(containerState.left + mouseX - containerState.mouseX, containerState.top + mouseY - containerState.mouseY);
}

function startRotation() {
    event.preventDefault();
    event.stopPropagation();
    saveContainerState();
    document.addEventListener("mousemove", rotation);
    document.addEventListener("mouseup", endRotation);
}

function endRotation() {
    event.preventDefault();
    document.removeEventListener("mousemove", rotation);
    document.removeEventListener("mouseup", endRotation);
    containerAngle += angle;
}

function rotation(e) {
    let centerX = containerState.left + containerState.width / 2;
    let centerY = containerState.top + containerState.height / 2;

    let mouseX = event.clientX + workspace.scrollLeft;
    let mouseY = event.clientY + workspace.scrollTop;

    let aX = containerState.mouseX - centerX;
    let aY = containerState.mouseY - centerY;

    let bX = mouseX - centerX;
    let bY = mouseY - centerY;

    let ab = aX * bX + aY * bY;
    let aLen = Math.sqrt(aX * aX + aY * aY);
    let bLen = Math.sqrt(bX * bX + bY * bY);

    let angleCos = ab / (aLen * bLen);
    angle = Math.acos(angleCos);
    if (aX * bY - aY * bX < 0) {
        angle *= -1;
    }

    rotateContainer(containerAngle + angle);
}

function rotateContainer(angle) {
    containerWrapper.style.webkitTransform = "rotate(" + angle + "rad)";
    containerWrapper.style.transform = "rotate(" + angle + "rad)";
}

function resizeContainer(width, height) {
    let img = document.querySelector("#selectedImage");
    img.style.width = width + "px";
    img.style.height = height + "px";
}

function moveContainer(left, top) {
    containerWrapper.style.left = left + "px";
    containerWrapper.style.top = top + "px";
}

function rotateLeft() {
    containerAngle -= Math.PI / 2;
    rotateContainer(containerAngle);
}

function rotateRight() {
    containerAngle += Math.PI / 2;
    rotateContainer(containerAngle);
}

function flipContainer() {
    let img = document.querySelector("#selectedImage");
    img.style.webkitTransform = "scale(" + containerState.scaleX + "," + containerState.scaleY + ")";
    img.style.transform = "scale(" + containerState.scaleX + "," + containerState.scaleY + ")";
}

function flipContainerHorizontally() {
    containerState.scaleY *= -1;
    flipContainer();
}

function flipContainerVertically() {
    containerState.scaleX *= -1;
    flipContainer();
}


/* Панель инструментов */
toolPanel.addEventListener("mousedown", toolPanelClick);

function toolPanelClick() {
    let target = event.target;
    let toolButton = target.closest(".button");
    let activeTool = document.querySelector(".button.active");

    if (toolButton != null && toolButton != activeTool) {
        toggleToolButton(activeTool)
        toolButtonClick();
        if (activeTool == firstToolBtn) {
            removeWorkspaceCorner();
        }
    }
}

function toolButtonClick() {
    let button = event.target;
    toggleToolButton(button);

    if (button.closest(".button") == firstToolBtn) {
        addWorkspaceCorner();
    }

    button = button.querySelector("button") || button; // не удаляйте эту строку больше, пожалуйста

    /* Обнуление */
    canvas.onmousemove = function () {}
    canvas.onmousedown = function () {}
    canvas.onmouseup = function () {}

    switch (button.name) {
        case "pencilTool":
            pencilClick();
            break;
        case "brushTool":
            alertChanger();
            brushClick();
            break;
        case "eraserTool":
            eraserClick();
            break;
        case "figuresTool":
            /*функционал*/
            break;
        case "lineTool":
            lineClick();
            break;
    }
}

function toggleToolButton(button) {
    button.closest(".button").classList.toggle("active");
}

/* Изменение толщины */
function changeLineWidth(brushSize) {
    context.lineWidth = brushSize;
}

// Изменение прозрачности
function changeOpacity(opacityPercent) {
    context.globalAlpha = 1.0 - opacityPercent;
}

/* значения слайдеров */
let range = document.querySelector(".slider");
let rangeNums = document.querySelector(".rangeNum");
range.oninput = function () {
    rangeNums.style.left = this.value * 5 + "px";
    rangeNums.innerHTML = this.value;
}

let rangeOp = document.querySelector(".sliderOp");
let opacityNums = document.querySelector(".opacityNum");
rangeOp.oninput = function () {
    opacityNums.style.left = this.value * 150 + "px";
    opacityNums.innerHTML = this.value;
}

/* Очистка холста */
document.getElementById("clean").onclick = function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
};

/* Рисование основным и доп цветом */
var currentColor = '#000000';
var currentColor2 = '#ffffff';

document.querySelector("input[name=mainColor]").oninput = function () {
    currentColor = this.value;
}

document.querySelector("input[name=additionalColor]").oninput = function () {
    currentColor2 = this.value;
}

/* Поменять цвета местами и ч/б */
document.querySelector("button[name=swapColors]").addEventListener("click", swapMainAndAdditionalColors);

function swapMainAndAdditionalColors() {
    document.querySelector("input[name=mainColor]").value = currentColor2;
    document.querySelector("input[name=additionalColor]").value = currentColor;

    var c = currentColor;
    currentColor = currentColor2;
    currentColor2 = c;
}

document.querySelector("button[name=blackWhite]").addEventListener("click", makeBlackAndWhite);

function makeBlackAndWhite() {
    currentColor = '#000000';
    currentColor2 = '#ffffff'
    document.querySelector("input[name=mainColor]").value = currentColor;
    document.querySelector("input[name=additionalColor]").value = currentColor2;
}

/* Отменить */
document.getElementById('undo').addEventListener("change", undo_last);

let restore_array = [];
let index = -1;
var restore_state;

function undo_last() {
    if (index <= 0) {
        clearCanvas();
    } else {
        index -= 1;
        restore_state = restore_array.pop();
        context.putImageData(restore_array[index], 0, 0);
    }
}