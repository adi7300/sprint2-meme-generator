'use strict'

var gCanvas;
var gCtx;
var gCurrCordonations; //x,y, width, height;
const gInitialText = "Your text here";

function onInit() {
    gCanvas = document.getElementById('my-canvas')
    gCtx = gCanvas.getContext('2d');
    gCurrCordonations = { x: 100, y: 10, widthX: 400, heightY: 70 };
    if (window.innerWidth < 580) {
        gCanvas.width = window.innerWidth * 0.9;
        gCanvas.height = 600;
    }
    buildGallery(getImages());
    renderKeywords();
    resetData();
    onGalleryClick();
}

function toggleMenu() {
    document.querySelector("body").classList.toggle("open-menu");
}

function buildGallery(images) {
    var strHTML = '';
    images.forEach(image => {
        strHTML += `<div class="gallery_item "><img class="gallery_img" src=${image.url} 
        onclick="onImgClick('${image.id}')"></div>`;
    });
    document.querySelector(".grid-gallery").innerHTML = strHTML;
}

function renderKeywords() {
    var elKeywordsDiv = document.querySelector(".keywords-bar");
    var strHtml = '';
    var keywordsMap = getKeywordsMap();
    var size = '';
    for (var keyword in keywordsMap) {
        if (keywordsMap[keyword] > 2) {
            size = 'small-txt';
            if (keywordsMap[keyword] > 10) size = 'large-txt';
            else if (keywordsMap[keyword] > 6) size = 'medium-txt';
            strHtml += `<p value=${keyword} class="keyword ${size}" onclick="filterByKeyword('${keyword}')">${keyword}</p>`
        }
    };
    elKeywordsDiv.innerHTML = strHtml;
}

function filterByKeyword(filterWord) {
    console.log('filterWord is:', filterWord);
    buildGallery(getImages(filterWord));
    renderCanvas();
}

function onGalleryClick() {
    document.querySelector(".grid-gallery").classList.remove('hidden');
    document.querySelector(".search-bar").classList.remove('hidden');
    document.querySelector(".grid-editor").classList.add('hidden');

}

function onDisplayEditor() {
    var imgId = getMemeSelectedImg();
    if (imgId !== -1) {
        document.querySelector(".grid-gallery").classList.add('hidden');
        document.querySelector(".search-bar").classList.add('hidden');
        document.querySelector(".grid-editor").classList.remove('hidden');
        document.querySelector(".editor-btn").style.color = 'black';
        cleanTextLine();
    }
}

function cleanTextLine() {
    var txtLine = document.querySelector(".meme-text");
    txtLine.value = '';
    txtLine.placeholder = 'Your Text here'
}

function onAddRowclick() {
    incSelectedLine();
    setMemeTextData(gInitialText, gCanvas);
    setBorderCoordinations();
    renderCanvas();
    cleanTextLine();
    document.querySelector(".meme-text").focus();
    document.querySelector(".txt-impact").value = 'Impact';

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
    if (!line || !line.txt) {
        gCurrCordonations.x = 100;
        gCurrCordonations.widthX = gCtx.measureText(gInitialText).width + 50;
        gCurrCordonations.y = 10;
        gCurrCordonations.heightY = 70;
    }

    else {
        gCurrCordonations.x = line.x - (gCtx.measureText(line.txt).width) / 2 - 15;
        gCurrCordonations.widthX = gCtx.measureText(line.txt).width + 30;
        gCurrCordonations.y = line.y - line.size;
        gCurrCordonations.heightY = line.size + 5;
    }
}

function renderCanvas() {
    placeImg(getSelectedImgId());
    var memeText = getMemeTextData();
    var line = memeText[gLinesCounter];
    if (!line || !line.txt) {
        if (line) {
            drawText(gInitialText, line.x, line.y);
        }
        else drawText(gInitialText, gCanvas.width / 2, 70);
    }
    drawTextBorder();
    if (memeText.length) {
        memeText.forEach((line, indx) => {
            setTimeout(() => { drawText(line.txt, line.x, line.y, indx) }, 0)
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
        var clickedLineText = getCurrLine(getSelectedLine()).txt;
        document.querySelector(".meme-text").value = clickedLineText;
        setBorderCoordinations();
        renderCanvas();
    }
}

function changeAtt(att, val = 0) {
    var currTextVals = getCurrLine(getSelectedLine());
    if (att === '+') currTextVals.size += 2;
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


function onTextEnter(data) {
    var text = data.value;
    setMemeTextData(text, gCanvas);
    setBorderCoordinations();
    renderCanvas();
}

function placeImg(imgId) {
    console.log('imdIg is:', imgId);
    var img = new Image();

    img.src = getImgbyId(imgId).url;
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    // img.onload = () => {
    //     gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    //     // drawText
    // }
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

function onImgUpload(ev) {
    loadImageFromInput(ev, renderCanvas)
}

function loadImageFromInput(ev, onImageReady) {
    document.querySelector('.grid-gallery').innerHTML = ''
    var reader = new FileReader();
    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}

function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");

    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl);
        document.querySelector('.share').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
        Share   
        </a>`
    }
    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {

    var formData = new FormData(elForm);
    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
        .then(function (res) {
            return res.text()
        })
        .then(onSuccess)
        .catch(function (err) {
            console.error(err)
        })
}

