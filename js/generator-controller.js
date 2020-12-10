'use strict'

var gCanvas;
var gCtx;
var gCurrCordonations; //x,y,start,end;

function onInit() {
    gCurrCordonations = { x: 100, y: 10, widthX: 400, heightY: 70 };
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d');
    buildGallery();
    resetData();
    onGalleryClick();
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
    var imgId = getMemeSelectedImg();
    if (imgId !== -1) {
        document.querySelector(".grid-gallery").classList.add('hidden');
        document.querySelector(".grid-editor").classList.remove('hidden');
        document.querySelector(".editor-btn").style.color = 'black';

        cleanTextLine();
    }
    else alert('Please select an image first ');
}

function cleanTextLine() {
    var txtLine = document.querySelector(".meme-text");
    txtLine.value = '';
    txtLine.placeholder = "Enter your Text here"
}

function onAddRowclick() {
    incSelectedLine();
    setMemeTextData('', gCanvas);
    setBorderCoordinations();
    renderCanvas();
    cleanTextLine();
}

function onDeleteRowclick() {
    deleteRow();
    renderCanvas();
}

function setBorderCoordinations() {
    var lines = getMemeTextData();
    var currLine = getSelectedLine();
    var line = lines[currLine];
    if (!line.txt) {
        gCurrCordonations.x = 100;
        gCurrCordonations.widthX = 436;
    }
    else {
        gCurrCordonations.x = line.x - line.txt.length * 15 - 10;
        gCurrCordonations.widthX = line.txt.length * 29 + 30;
    }

    gCurrCordonations.y = line.y - 58;
    gCurrCordonations.heightY = 70;
}

function renderCanvas() {
    var selectedImgId = getSelectedImgId();
    placeImg(selectedImgId);
    var memeText = [];
    memeText = getMemeTextData();
    var line = memeText[gLinesCounter];
    if (!line || line.txt === "") {
        if (line) {
            drawText("Your Text here", line.x, line.y);
        }
        else drawText("Your Text here");
    }
    drawTextBorder();

    if (memeText.length) {
        memeText.forEach(line => {
            drawText(line.txt, line.x, line.y);
        });
    }
}

function drawTextBorder() {
    gCtx.beginPath();
    gCtx.lineWidth = '4'
    gCtx.strokeStyle = 'black'
    gCtx.rect(gCurrCordonations.x, gCurrCordonations.y, gCurrCordonations.widthX, gCurrCordonations.heightY); // x,y,widht,height
    gCtx.stroke();
}

function onCanvasClicked(click) {
    var selectedLine = checkPosition(click.offsetX, click.offsetY);
    if (selectedLine !== -1) {
        var memeLines = getMemeTextData();
        var clickedLine = memeLines[selectedLine];
        setBorderCoordinations();
        renderCanvas();
    }
}

function onReorderclick() {
    changeLineFocus();
    setBorderCoordinations();
    renderCanvas();
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}

function drawText(text, x = 300, y = 68) {
    gCtx.lineWidth = '3'
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = 'white'
    gCtx.font = '60px Impact'
    gCtx.textAlign = 'center'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function onImgClick(imgId) {
    setMemeImgData(imgId);
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
    setBorderCoordinations();
    renderCanvas();
}

function placeImg(imgId) {
    var img = new Image();
    img.src = getImgbyId(imgId).url;
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
}

function clearCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
}