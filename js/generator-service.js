'use strict'

var gImgs = []; //{id:id,url:url,keywords:[]}
var gLinesCounter = 0;
var gMeme = {
    selectedImgId: 0,
    selectedLineIdx: 0,
    lines: []   //txt: '', size: 0, align: '', color: '', x: '', y: '' 
}

onInit();

function onInit() {
    console.log('onInit called');
    createImgs();
}

function setMemeImgData(imgId) {
    gMeme.selectedImgId = imgId;
}

function incSelectedLine() {
    gLinesCounter++;
}


function setMemeTextData(text, canvas) {
    var y = 0;
    var lineCounter = gMeme.lines.length;
    console.log('lineCounter is:', lineCounter);
    var canHeight = canvas.height;
    if (lineCounter === 1) y = canHeight / 10;
    else if (lineCounter === 2) y = canHeight - canHeight / 10;
    else if (lineCounter > 2) y = canHeight / 2;

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

function getImgbyId(id) {
    return gImgs.find(img => img.id === parseInt(id))
}

function createImgs() {
    console.log('images created');
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

