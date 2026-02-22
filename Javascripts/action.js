

document.addEventListener('DOMContentLoaded', () => {
    // 1. 攔截目前的 URL 參數
    const params = new URLSearchParams(window.location.search)
    const frameId = params.get('frame_id')

    //2. 偵錯
    //console.log("目前的邊框 ID 是：", frameId);

    //3.get 2 buttons
    const camerabutton = document.getElementById('menu-camera-button')
    const uploadbutton = document.getElementById('menu-upload-button')

    if (!frameId) {
        frameId = 'frame-1';
    }

    if (camerabutton) {
        camerabutton.addEventListener('click', () => {
            //e.preventDefault();
            //setTimeout(() => {
            window.location.href = `camera.html?frame_id=${frameId}`;
            // }, 100)
        });
    }
    if (uploadbutton) {
        uploadbutton.addEventListener('click', () => {
            //e.preventDefault();
            //setTimeout(() => {
            window.location.href = `upload.html?frame_id=${frameId}`;
            // }, 100)
        });
    }

})

// header redirect
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    if (header) header.addEventListener('click', () => window.location.href = 'index.html');
});