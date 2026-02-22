//1. 換框

let frameImg

document.addEventListener('DOMContentLoaded', () => {
    // 1. 攔截目前的 URL 參數
    const params = new URLSearchParams(window.location.search)
    const frameId = params.get('frame_id')

    //2. 偵錯
    console.log("目前的邊框 ID 是：", frameId);

    //3. 偵錯 
    frameImg = document.querySelector('.frame-overlay');

    if (frameId && frameImg) {

        frameImg.src = `Assets/myday-photobooth/camerapage/${frameId}.png`;

        // 4. 確保圖片載入後再顯示，避免破圖感
        frameImg.onload = () => {
            frameImg.style.opacity = "1";
        };
    } else {
        frameImg.src = `Assets/myday-photobooth/camerapage/frame-1.png`;

    }

});


// clear local storage
window.addEventListener('DOMContentLoaded', () => localStorage.removeItem('photoStrip'));

// constants
const WIDTH = 1244, HEIGHT = 1866, HALF = HEIGHT / 2;

// dom elements
const elements = {
    canvas: document.getElementById('finalCanvas'),
    ctx: document.getElementById('finalCanvas').getContext('2d'),
    uploadInput: document.getElementById('uploadPhotoInput'),
    uploadBtn: document.getElementById('upload-button'),
    readyBtn: document.getElementById('ready-button'),
};

let photoStage = 0; // 0=top,1=bottom,2=donee

const FRAME_CONFIG = {
    top: { y: 113, height: 700 },    // 第一格的起始 Y 與高度
    bottom: { y: 813, height: 700 } // 第二格的起始 Y 與高度
};

// draw photo
const drawPhoto = img => {
    const { ctx } = elements;
    const currentConfig = photoStage === 0 ? FRAME_CONFIG.top : FRAME_CONFIG.bottom;
    const yOffset = currentConfig.y;
    const drawHeight = currentConfig.height;
    const imgAspect = img.width / img.height
    const targetAspect = WIDTH / drawHeight;
    let sx, sy, sw, sh;

    if (imgAspect > targetAspect) {
        sh = img.height;
        sw = img.height * targetAspect;
        sx = (img.width - sw) / 2;
        sy = 0;
    }
    else {
        sw = img.width;
        sh = img.width / targetAspect;
        sx = 0; sy = (img.height - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, yOffset, WIDTH, drawHeight);
    photoStage++;
    if (photoStage === 2) {
        setTimeout(finalizePhotoStrip, 50);
    }
};

// finalize photo strip
const finalizePhotoStrip = () => {
    const { ctx, readyBtn, downloadBtn, uploadBtn } = elements;
    const frame = new Image();
    frame.onload = () => {
        ctx.drawImage(frame, 0, 0, WIDTH, HEIGHT);
        uploadBtn.style.display = 'none';
        readyBtn.style.display = 'inline-block';
        readyBtn.disabled = false;
        //downloadBtn.style.display = 'inline-block';
    };

    // 確保這裡抓到的 src 是正確的動態路徑
    const currentSrc = frameImg ? frameImg.src : 'Assets/myday-photobooth/camerapage/frame-1.png';
    frame.src = currentSrc;
};

// ready button
elements.readyBtn.addEventListener('click', () => {
    localStorage.setItem('photoStrip', elements.canvas.toDataURL('image/png'));
    window.location.href = 'final.html';
});


// upload button
elements.uploadBtn.addEventListener('click', () => elements.uploadInput.click());

// handle upload
elements.uploadInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => drawPhoto(img);
    img.src = URL.createObjectURL(file);
    elements.uploadInput.value = '';
});
