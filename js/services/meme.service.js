'use strict'

var gImgs = [];

const gMeme = {
    selectedImgId: 0,
    // imgUrl:none,
    selectedLineIdx: 0,
    lines: [
        {
            dim: { x: 10, y: 10, w: 0, h: 0 },
            isDrag: false,
            txt: 'Type text here',
            fontSize: 30,
            font: 'impact',
            align: 'left',
            color: 'black',
            stroke: 'white',
            posX: 10,
            posY: 5,
        }]
}

createImgs()

function createImgs() {
    for (let i = 0; i < 18; i++) {
        gImgs.push(createImg(i + 1))
    }
}

function createImg(num) {
    return {
        id: _makeId(),
        url: `./img/meme-imgs (square)/${num}.jpg`,
        keywords: []
    }
}

function getImgs() {
    return gImgs;
}

function getImg(imgId) {
    return gImgs.find(img => img.id === imgId)
}

function setMemeImg(id) {
    gMeme.selectedImgId = id;
}

function getMeme() {
    return gMeme
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].fontSize += diff
}

function setColor(color) {
    // console.log(color);
    gMeme.lines[gMeme.selectedLineIdx].color = color

}
function setColorStroke(color) {
    // console.log(color);
    gMeme.lines[gMeme.selectedLineIdx].stroke = color

}

function switchLine(isNewLine) {
    const idxSelected = gMeme.selectedLineIdx

    if (isNewLine) {
        gMeme.selectedLineIdx = gMeme.lines.length - 1
    } else if (idxSelected < gMeme.lines.length - 1) {
        gMeme.selectedLineIdx++

    } else gMeme.selectedLineIdx = 0
}

function addLine(canvasHeight) {
    var yPos


    switch (gMeme.lines.length) {
        case 0:
            yPos = 5;
            break;
        case 1:
            yPos = canvasHeight - 50;
            break;
        default:
            yPos = canvasHeight / 2;
            break;
    }

    gMeme.lines.push({
        dim: { x: 10, y: yPos, w: 0, h: 0 },
        isDrag: false,
        txt: 'add text',
        fontSize: 30,
        font: 'impact',
        align: 'left',
        color: 'black',
        stroke: 'white',
        posX: 10,
        posY: 0,
    })
    switchLine(true)
}

function removeLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    gMeme.selectedLineIdx = 0;
}

function setTextAlign(direction, canvasWidth) {
    gMeme.lines[gMeme.selectedLineIdx].align = direction;


    switch (gMeme.lines[gMeme.selectedLineIdx].align) {
        case 'left':
            gMeme.lines[gMeme.selectedLineIdx].dim.x = 10;
            break;
        case 'right':
            gMeme.lines[gMeme.selectedLineIdx].dim.x = canvasWidth - 10 - gMeme.lines[gMeme.selectedLineIdx].dim.w;
            break;
        case 'center':
            gMeme.lines[gMeme.selectedLineIdx].dim.x = canvasWidth / 2 - gMeme.lines[gMeme.selectedLineIdx].dim.w / 2;
            break;
    }
}


// todo: move to util

function _makeId(length = 6) {
    let txt = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}


function setDim(w, h) {

    gMeme.lines[gMeme.selectedLineIdx].dim.h = h
    gMeme.lines[gMeme.selectedLineIdx].dim.w = w

}
function setDimX(x) {
    gMeme.lines[gMeme.selectedLineIdx].dim.x = x

}

function setlineDrag(isDrag, idx) {
    if (isDrag) gMeme.selectedLineIdx = idx
    gMeme.lines[gMeme.selectedLineIdx].isDrag = isDrag
}

function getLineSelected() {
    return gMeme.lines[gMeme.selectedLineIdx]
}


function moveLine(dx, dy) {
    gMeme.lines[gMeme.selectedLineIdx].dim.x += dx
    gMeme.lines[gMeme.selectedLineIdx].dim.y += dy

}
function changeFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font

}