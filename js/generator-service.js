'use strict'

var gImgs = []; //{id:id,url:url,keywords:[]}
var gLinesCounter = 0;
// var gTextStyle = { size: 60, color: 'white', align: 'center' };
var gMeme = {
    selectedImgId: -1,
    selectedLineIdx: 0,
    lines: []   //txt: '', size: 0, align: '', color: '', x: '', y: '' 
}

onInit();


function onInit() {
    createImgs();
}

function resetData() {
    gLinesCounter = 0;
    gMeme = {
        selectedImgId: -1,
        selectedLineIdx: 0,
        lines: []
    };
}

function setMemeImgData(imgId) {
    gMeme.selectedImgId = imgId;
}

function incSelectedLine() {
    gMeme.selectedLineIdx++;
    gLinesCounter++;
}

function deleteRow() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    var currLine = gMeme.selectedLineIdx;
    if (currLine >= gMeme.lines.length) {
        currLine -= gMeme.lines.length;
    }
    gMeme.selectedLineIdx = currLine;
    gLinesCounter--;
    if (!gMeme.lines.length) {
        gLinesCounter = 0;
    }
}

function changeLineFocus() {
    var currLine = gMeme.selectedLineIdx;
    currLine++;
    if (currLine >= gMeme.lines.length) {
        currLine -= gMeme.lines.length;
    }
    gMeme.selectedLineIdx = currLine;
    return gMeme.lines[gMeme.selectedLineIdx].txt;
}


function getSelectedLine() {
    return gMeme.selectedLineIdx;
}

function getCurrLine(i) {
    return gMeme.lines[i];
}

function checkPosition(x, y) {
    if (!gMeme.lines.length) return -1;
    gMeme.lines.forEach((position, idx) => {
        var len = position.txt.length;
        var minX = position.x - (25 * position.txt.length) / 2 - 10;
        var maxX = position.x + (25 * position.txt.length) / 2 + 10;
        var minY = position.y - 50;
        var maxY = position.y + 5;
        if (y > minY && y < maxY && x > minX && x < maxX) {
            gMeme.selectedLineIdx = idx;
        }
    })
    return gMeme.selectedLineIdx;
}


function drawUnderline(x, y, xEnd = 250, yEnd = 250) {
    gCtx.beginPath()
    gCtx.moveTo(x, y)
    gCtx.lineTo(xEnd, yEnd)
    gCtx.closePath()
    gCtx.strokeStyle = '#ff0000'
    gCtx.stroke()

}
function setTextAlignment(ctx, canvas) {
    if (gMeme.lines[gMeme.selectedLineIdx]) {
        if (gMeme.lines[gMeme.selectedLineIdx].align === 'right') {
            gMeme.lines[gMeme.selectedLineIdx].x = canvas.width - ctx.measureText(gMeme.lines[gMeme.selectedLineIdx].txt).width + 20;
        }
        else if (gMeme.lines[gMeme.selectedLineIdx].align === 'left') {
            gMeme.lines[gMeme.selectedLineIdx].x = ctx.measureText(gMeme.lines[gMeme.selectedLineIdx].txt).width - 20;
        }
        else if (gMeme.lines[gMeme.selectedLineIdx].align === 'center') {
            gMeme.lines[gMeme.selectedLineIdx].x = canvas.width / 2;
        }

    }
}

function setMemeTextData(text, canvas) {
    var y = 70;
    var x = canvas.width / 2;
    var canHeight = canvas.height;
    if (gMeme.selectedLineIdx === 0) y = canHeight / 10;
    else if (gMeme.selectedLineIdx === 1) y = canHeight - canHeight / 10;
    else if (gMeme.selectedLineIdx > 1) y = canHeight / 2;



    gMeme.lines[gMeme.selectedLineIdx] = createLine(text, x, y);
}


function createLine(text, x, y, size = 60, align = 'center', color = 'white', font = 'Impact') {
    return {
        txt: text,
        x: x,
        y: y,
        size: size,
        align: align,
        color: color,
        font: font,
    }
}

function getSelectedImgId() {
    return gMeme.selectedImgId;
}

function getMemeTextData() {
    return gMeme.lines;
}

function getMemeSelectedImg() {
    return gMeme.selectedImgId;
}

function getImgbyId(id) {
    return gImgs.find(img => img.id === parseInt(id))
}

function createImgs() {
    for (var i = 0; i < 18; i++) {
        gImgs.push(createImg(gImgs.length));
    }
}


function createImg(len) {
    return {
        id: len + 1,
        url: `imgs/${len + 1}.jpg`,
        keywords: [],
    }
}

