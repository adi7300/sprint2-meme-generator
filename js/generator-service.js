'use strict'

var gImgs = [];
var gKeywordsMap = {};
var gLinesCounter = 0;
var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    lines: []
}

init();

function countKeywords() {
    gImgs.forEach(img =>
        img.keywords.forEach(keyword => {
            var count = gKeywordsMap[keyword];
            gKeywordsMap[keyword] = count ? count + 1 : 1;
        })
    );
}

function init() {
    createImgs();
    countKeywords();
}

function getImages(filterby = 'all') {
    if (filterby === 'all') return gImgs;
    var resultImg = [];
    for (var i = 0; i < gImgs.length; i++) {
        if (gImgs[i].keywords.join().includes(filterby)) {
            resultImg.push(gImgs[i]);
        }
    }
    // resultImg = gImgs.filter(imgRow => {
    //     imgRow.keywords.includes(filterby);
    // });
    console.log('filteredImgs is:', resultImg);
    return resultImg;
}

function getKeywordsMap() {
    return gKeywordsMap;
}

function resetData() {
    gLinesCounter = 0;
    gMeme = {
        selectedImgId: 1,
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

function getCurrLine(idx) {
    return gMeme.lines[idx];
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

function setXYPosition(x, y) {
    gMeme.lines[gMeme.selectedLineIdx].x = x;
    gMeme.lines[gMeme.selectedLineIdx].y = y;
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
    var canvasHeight = canvas.height;
    if (!gMeme.selectedLineIdx) y = canvasHeight / 10;
    else if (gMeme.selectedLineIdx === 1) y = canvasHeight - canvasHeight / 10;
    else if (gMeme.selectedLineIdx > 1) y = canvasHeight / 2;
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
    gImgs.push(createImg(1, 'imgs/1.jpg', ['USA', 'politics', 'man']));
    gImgs.push(createImg(2, 'imgs/2.jpg', ['dog', 'animals', 'sweet']));
    gImgs.push(createImg(3, 'imgs/3.jpg', ['baby', 'animals', 'dog', 'sweet']));
    gImgs.push(createImg(4, 'imgs/4.jpg', ['cat', 'animals', 'computer']));
    gImgs.push(createImg(5, 'imgs/5.jpg', ['baby', 'angry']));
    gImgs.push(createImg(6, 'imgs/6.jpg', ['movie', 'skeptical', 'man']));
    gImgs.push(createImg(7, 'imgs/7.jpg', ['baby', 'surprise']));
    gImgs.push(createImg(8, 'imgs/8.jpg', ['movie', 'skeptical', 'funny', 'man']));
    gImgs.push(createImg(9, 'imgs/9.jpg', ['baby', 'funny']));
    gImgs.push(createImg(10, 'imgs/10.jpg', ['man', 'funny', 'USA', 'politics']));
    gImgs.push(createImg(11, 'imgs/11.jpg', ['fight', 'man']));
    gImgs.push(createImg(12, 'imgs/12.jpg', ['man']));
    gImgs.push(createImg(13, 'imgs/13.jpg', ['success', 'movie', 'man']));
    gImgs.push(createImg(14, 'imgs/14.jpg', ['movie', 'man']));
    gImgs.push(createImg(15, 'imgs/15.jpg', ['movie', 'man']));
    gImgs.push(createImg(16, 'imgs/16.jpg', ['movie', 'funny', 'man']));
    gImgs.push(createImg(17, 'imgs/17.jpg', ['russia', 'politics', 'man']));
    gImgs.push(createImg(18, 'imgs/18.jpg', ['afraid', 'movie', 'man']));
}


function createImg(id, url, keywords) {
    return {
        id: id,
        url: url,
        keywords: keywords,
    }
}

