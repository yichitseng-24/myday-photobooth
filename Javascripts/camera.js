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


// 2. 處理換框
const WIDTH = 1244, HEIGHT = 1866, HALF = HEIGHT / 2;

const FRAME_CONFIG = {
    top: { y: 113, height: 700 },    // 第一格的起始 Y 與高度
    bottom: { y: 813, height: 700 } // 第二格的起始 Y 與高度
};

// dom elements
const elements = {
    video: document.getElementById('liveVideo'),
    canvas: document.getElementById('finalCanvas'),
    ctx: document.getElementById('finalCanvas').getContext('2d'),
    takePhotoBtn: document.getElementById('capture-button'), // capture button
    // downloadBtn: document.getElementById('downloadBtn'),
    countdownEl: document.querySelector('.countdown-timer')
};

let photoStage = 0; // 0=top,1=bottom,2=done photoStage: 這是一個「狀態機」，用來記錄目前拍到哪一格了

// move video to half 
// 會根據目前拍到第幾格，動態調整 <video> 元素在螢幕上的位置
const moveVideoToHalf = i => {
    const { video } = elements;
    video.style.display = 'block';
    video.style.width = '100%';

    if (i == 0) {
        video.style.top = `${(FRAME_CONFIG.top.y / HEIGHT) * 100}%`;
        video.style.height = `${(FRAME_CONFIG.top.height / HEIGHT) * 100}%`;
    } else {
        video.style.top = `${(FRAME_CONFIG.bottom.y / HEIGHT) * 100}%`;
        video.style.height = `${(FRAME_CONFIG.bottom.height / HEIGHT) * 100}%`;
    }
};

// countdown
// 當倒數到 0 時，會清除計時器（clearInterval）、隱藏文字，並執行 callback()（也就是觸發拍照功能）
const startCountdown = callback => {
    let count = 3;
    const { countdownEl } = elements;
    countdownEl.textContent = count;
    countdownEl.style.display = 'flex';
    const intervalId = setInterval(() => {
        count--;
        if (count > 0) countdownEl.textContent = count;
        else {
            clearInterval(intervalId);
            countdownEl.style.display = 'none';
            callback();
        }
    }, 1000);
};

// capture photo 
// 由於攝影機的畫面比例（通常是 16:9 或 4:3）與你的拍貼框（1176:735）不合
// 程式會自動計算 sx, sy, sw, sh。這是在做 Center Crop（中央裁切），確保拍出來的人像不會被拉伸變形。
const capturePhoto = () => {
    const { video, ctx, takePhotoBtn } = elements;
    const currentConfig = photoStage === 0 ? FRAME_CONFIG.top : FRAME_CONFIG.bottom;
    const yOffset = currentConfig.y;
    const drawHeight = currentConfig.height;
    const vW = video.videoWidth, vH = video.videoHeight;
    const targetAspect = WIDTH / drawHeight, vAspect = vW / vH;
    let sx, sy, sw, sh;

    if (vAspect > targetAspect) { sh = vH; sw = vH * targetAspect; sx = (vW - sw) / 2; sy = 0; }
    else { sw = vW; sh = vW / targetAspect; sx = 0; sy = (vH - sh) / 2; }

    ctx.save();
    ctx.translate(WIDTH, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, sw, sh, 0, yOffset, WIDTH, drawHeight);
    ctx.restore();
    // 拍完第一張後，會自動把 takePhotoBtn 恢復成可點擊狀態，並將影片預覽移到下半部。

    photoStage++;
    if (photoStage === 1) {
        moveVideoToHalf(1);
        setTimeout(() => {
            startCountdown(capturePhoto);
        }, 1000)
        //takePhotoBtn.disabled = false; 
    }
    else if (photoStage === 2) finalizePhotoStrip();
};

// finalize photo strip。
// 當 photoStage === 2（兩張都拍完）時觸發
const finalizePhotoStrip = () => {
    const { video, ctx, canvas } = elements;
    video.style.display = 'none';
    const frame = new Image();
    // 讀取 frame.png 並將其畫在最上層，蓋住兩張照片的邊緣
    frame.src = frameImg ? frameImg.src : 'Assets/myday-photobooth/camerapage/frame-1.png';
    frame.onload = () => {
        ctx.drawImage(frame, 0, 0, WIDTH, HEIGHT);
        // 使用 canvas.toDataURL 將畫布轉為圖片字串，存入 localStorage。
        // 這樣在下一頁 final.html 就能直接抓取這張照片顯示，不需要重新繪製。
        localStorage.setItem('photoStrip', canvas.toDataURL('image/png'));
        setTimeout(() => window.location.href = 'final.html', 50);
    };
    frame.complete && frame.onload();
};



// setup camera 請求攝影機權限，特別設定了 ideal 高畫質參數。
const setupCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 2560 }, height: { ideal: 1440 }, facingMode: 'user' }, audio: false })
        .then(stream => { elements.video.srcObject = stream; elements.video.play(); moveVideoToHalf(0); })
        .catch(err => alert('Camera access failed: ' + err));
};

// setup events 監聽: 確保使用者旋轉手機或縮放視窗時，影片預覽位置不會跑掉。
const setupEventListeners = () => {
    const { takePhotoBtn } = elements;

    takePhotoBtn.addEventListener('click', () => {
        if (photoStage > 1) return;
        takePhotoBtn.disabled = true;
        startCountdown(capturePhoto);
    });

};

// initialize photo booth
const initPhotoBooth = () => { setupCamera(); setupEventListeners(); };

initPhotoBooth();

// header redirect
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    if (header) header.addEventListener('click', () => window.location.href = 'index.html');
});