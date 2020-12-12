'use strict'

var gCanvas;
var gCtx;
var gCurrCordonations; //x,y, width, height;
const gInitialText = "Your text here";

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
}

function onAddRowclick() {
    incSelectedLine();
    setMemeTextData(gInitialText, gCanvas);
    setBorderCoordinations();
    renderCanvas();
    cleanTextLine();
    document.querySelector(".meme-text").focus();
    document.querySelector(".txt-impact").value = "Impact";

}

function onDeleteRowClick() {
    deleteRow();
    setBorderCoordinations();
    renderCanvas();
    cleanTextLine();
    document.querySelector(".meme-text").focus();
}

function setBorderCoordinations() {
    var line = getCurrLine(getSelectedLine());
    if (!line) {
        gCurrCordonations.x = 100;
        gCurrCordonations.widthX = gCtx.measureText(gInitialText).width + 50;
        gCurrCordonations.y = 10;
    }
    else {
        gCurrCordonations.x = line.x - (gCtx.measureText(line.txt).width) / 2 - 15;
        gCurrCordonations.widthX = gCtx.measureText(line.txt).width + 30;
        gCurrCordonations.y = line.y - 58;
    }
    gCurrCordonations.heightY = 70;
}

function renderCanvas() {
    placeImg(getSelectedImgId());
    var memeText = getMemeTextData();
    var line = memeText[gLinesCounter];
    if (!line || line.txt === "") {
        if (line) {
            drawText(gInitialText, line.x, line.y);
        }
        else drawText(gInitialText, 300, 70);
    }
    drawTextBorder();
    if (memeText.length) {
        memeText.forEach((line, indx) => {
            drawText(line.txt, line.x, line.y, indx);
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
    console.log(click.offsetX, click.offsetY);
    var selectedLine = checkPosition(click.offsetX, click.offsetY);
    if (selectedLine !== -1) {
        var clickedLineText = getCurrLine(getSelectedLine()).txt;
        document.querySelector(".meme-text").value = clickedLineText;
        setBorderCoordinations();
        renderCanvas();
    }
}

function changeAtt(att, val = 0) {
    var currTextVals = getCurrLine(getSelectedLine());
    if (att === '+')
        currTextVals.size += 2;
    else if (att === '-') currTextVals.size -= 2;
    else if (att === 'color') currTextVals.color = val.value;
    else if (att === 'font') currTextVals.font = val.value;
    else if (att === 'underline') {
        currTextVals.align = val;
        setTextAlignment(gCtx, gCanvas);
    }

    setBorderCoordinations();
    renderCanvas();
}


function drawText(text, x = 300, y = 68, i) {
    var currTextVals = getCurrLine(i);
    var size = currTextVals ? currTextVals.size : 60;
    var color = currTextVals ? currTextVals.color : 'white'
    var font = currTextVals ? currTextVals.font : 'Impact'
    gCtx.lineWidth = '3';
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = color;
    gCtx.font = `${size}px ${font}`;
    gCtx.textAlign = 'center';
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
    // canvas.width = window.innerWidth;
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

function onReorderclick() {
    var text = changeLineFocus();
    document.querySelector(".meme-text").value = text;

    setBorderCoordinations();
    renderCanvas();
}

function downloadImg(elLink) {
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}


