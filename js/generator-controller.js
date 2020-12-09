'use strict'

var gCanvas;
var gCtx;

function onInit() {
    console.log('Let\'s the fun begin!!');
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d');
    buildGallery();
}

function buildGallery() {
    var strHTML = '';
    for (var i = 0; i < 18; i++) {
        strHTML += `<div class="gallery_item "><img class="gallery_img" src="imgs/${i + 1}.jpg" onclick="onImgClick('${i + 1}')"></div>`;
    }
    document.querySelector(".grid-gallery").innerHTML = strHTML;
}

function onGalleryClick() {
    document.querySelector(".grid-gallery").classList.remove('hidden');
    document.querySelector(".grid-editor").classList.add('hidden');
}

function onDisplayEditor() {
    document.querySelector(".grid-gallery").classList.add('hidden');
    document.querySelector(".grid-editor").classList.remove('hidden');
    cleanTextLine();
}

function cleanTextLine() {
    var txtLine = document.querySelector(".meme-text");
    txtLine.value = '';
    txtLine.placeholder = "Enter your Text here"

}

function onAddRowclick() {
    incSelectedLine();
    cleanTextLine();
}

function onImgClick(imgId) {
    setMemeImgData(imgId);
    setMemeTextData('', gCanvas);
    renderCanvas();
    onDisplayEditor();
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth;
    gCanvas.height = elContainer.offsetHeight;
}

function onTextEnter(data, val) {
    var text = data.value + val.key;
    setMemeTextData(text, gCanvas);
    renderCanvas();
}

function drawText(text, x, y) {
    gCtx.lineWidth = '3'
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = 'white'
    gCtx.font = '60px Impact'
    gCtx.textAlign = 'center'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function placeImg(imgId) {
    var img = new Image();
    img.src = getImgbyId(imgId).url;
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
}


function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    // You may clear part of the canvas
    // gCtx.clearRect(50, 50, 100, 100)
}

function renderCanvas() {
    var selectedImgId = getSelectedImgId();
    placeImg(selectedImgId);
    var memeText = [];
    memeText = getMemeTextData();

    if (memeText.length) {
        memeText.forEach(line => {
            drawText(line.txt, line.x, line.y);
        });
    }
}