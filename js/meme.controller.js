'use strict'
var isDownload = false
var gCanvas;
var gCtx;
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']
var gStartPos
var isDown = false


function onInit() {
    renderGallery()
    document.querySelector('.meme-gen-editor').style.display = 'none'


}



function renderGallery() {
    const imgs = getImgs()
    // console.log('imgs', imgs)
    const strHTML = imgs.map((img, idx) => {
        const className = `img${idx + 1}`
        return `<img onclick=" onImgSelect('${img.id}')" class="${className}" src="${img.url}" alt="meme-img_${idx}">`
    })
    document.querySelector('.main-gallery').innerHTML = strHTML.join('')

}

function onImgSelect(imgId) {
    setMemeImg(imgId)
    renderMeme()
    addListeners()

    document.querySelector('.main-gallery').style.display = 'none'
    document.querySelector('.meme-gen-editor').style.display = 'block'
    document.querySelector('.meme-gen-editor').style.display = 'flex'
}

function renderMeme() {
    const meme = getMeme()

    const img = getImg(meme.selectedImgId);
    const newImg = new Image();
    newImg.src = img.url

    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    newImg.onload = () => {
        gCtx.drawImage(newImg, 0, 0, gCanvas.width, gCanvas.height);
        meme.lines.forEach((line, idx) => {
            gCtx.beginPath();

            //font and size
            gCtx.font = line.fontSize + 'px ' + line.font
            gCtx.lineWidth = 3

            //stroke
            gCtx.strokeStyle = line.stroke;
            gCtx.strokeText(line.txt, line.dim.x, line.dim.y + line.fontSize)
            gCtx.stroke();
            gCtx.fillText(line.txt, line.dim.x, line.dim.y + line.fontSize)

            //text
            gCtx.fillStyle = line.color;

            gCtx.closePath();

            //border line selected
            if (idx === meme.selectedLineIdx) {
                // if (isDownload) return

                document.querySelector('.control-title').value = line.txt
                let text = gCtx.measureText(line.txt)
                gCtx.beginPath()
                gCtx.lineWidth = 3
                gCtx.strokeStyle = 'red';
                gCtx.rect(line.dim.x - 5, line.dim.y - 5, text.width + 10, line.fontSize + 10);
                gCtx.stroke();
                gCtx.closePath();
                setDim(text.width + 10, line.fontSize + 10)
            }
        })
    }
}



function onWriteTxt(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onInchangeFontSize(diff) {
    setFontSize(diff)
    renderMeme()
}

function onChangeColor(color) {

    setColor(color)
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    renderMeme()
}

function onAddLine() {
    addLine(gCanvas.height)
    renderMeme()
}

function onRemoveLine() {
    removeLine()
    renderMeme()
}

function onSetTextAlign(direction) {
    setTextAlign(direction, gCanvas.width)
    renderMeme()
}

function addListeners() {
    addMouseListeners()
    addTouchListeners()
}

function addMouseListeners() {
    gCanvas.addEventListener('mousemove', onMove)
    gCanvas.addEventListener('mousedown', onDown)
    gCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
    gCanvas.addEventListener('touchmove', onMove)
    gCanvas.addEventListener('touchstart', onDown)
    gCanvas.addEventListener('touchend', onUp)
}

function getEvPos(ev) {
    var pos = {
        x: ev.offsetX,
        y: ev.offsetY
    }
    if (gTouchEvs.includes(ev.type)) {
        ev.preventDefault()
        ev = ev.changedTouches[0]
        pos = {
            x: ev.pageX - ev.target.offsetLeft,
            y: ev.pageY - ev.target.offsetTop
        }
    }
    return pos
}

function onDown(ev) {
    const pos = getEvPos(ev)
    const lineIdx = isLineClicked(pos)
    if (lineIdx === -1) return
    setlineDrag(true, lineIdx)
    renderMeme()
    gStartPos = pos

}

function onMove(ev) {

    const lineS = getLineSelected();
    if (!lineS.isDrag) return
    const pos = getEvPos(ev)
    const dx = pos.x - gStartPos.x
    const dy = pos.y - gStartPos.y
    moveLine(dx, dy)
    gStartPos = pos
    renderMeme()
}

function onUp() {
    setlineDrag(false)
}

function isLineClicked(pos) {

    let clickedLine = null
    clickedLine = gMeme.lines.findIndex(line => {

        return pos.x >= line.dim.x && pos.x <= line.dim.x + line.dim.w &&
            pos.y >= line.dim.y && pos.y <= line.dim.y + line.dim.h
    })


    return clickedLine

}

function onChangeFont(font) {
    changeFont(font)
    renderMeme()
}

function onChangeColorStroke(color) {
    setColorStroke(color)
    renderMeme()
}

function onBackToGallery() {
    document.querySelector('.meme-gen-editor').style.display = 'none'
    document.querySelector('.main-gallery').style.display = 'block'
    document.querySelector('.main-gallery').style.display = 'grid'
    // document.querySelector('.meme-gen-editor').style.display = 'flex'
    clearMeme()

}

function onDownloadCanvas(elLink) {
    isDownload = true;
    renderMeme()
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'awesome-meme';
    isDownload = false;
}