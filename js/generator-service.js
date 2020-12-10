'use strict'

var gImgs = []; //{id:id,url:url,keywords:[]}
var gLinesCounter = 0;
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
    gMeme.selectedLineIdx = 0;

}

function changeLineFocus() {
    var currLine = gMeme.selectedLineIdx;
    currLine++;
    if (currLine >= gMeme.lines.length) {
        currLine -= gMeme.lines.length;
    }
    gMeme.selectedLineIdx = currLine;

}

function getSelectedLine() {
    return gMeme.selectedLineIdx;
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

function setMemeTextData(text, canvas) {
    var y = 70;
    var canHeight = canvas.height;
    if (gLinesCounter === 0) y = canHeight / 10;
    else if (gLinesCounter === 1) y = canHeight - canHeight / 10;
    else if (gLinesCounter > 1) y = canHeight / 2;

    gMeme.lines[gLinesCounter] = createLine(text, canvas.width / 2, y);
}

function createLine(text, x, y) {

    return {
        txt: text,
        x: x,
        y: y,
        size: 60,
        color: 'white',
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

