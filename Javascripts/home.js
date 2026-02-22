const PHOTOBOOTH_FRAMES = Array.from({ length: 16 }, (_, i) =>
    `Assets/myday-photobooth/homepage/animated-photobooth-mock/${i + 1}.jpg`
);

// animation interval
const PHOTOBOOTH_FRAME_INTERVAL = 100;

// dom references DOM (Document Object Model)
const enterButton = document.getElementById('enter-button');
const denimalzEl_1 = document.querySelector('.denimalz-mock-1');
const denimalzEl_2 = document.querySelector('.denimalz-mock-2');
const photoboothEl = document.querySelector('.photobooth-mock');
//const cameraBtn = document.getElementById('menu-camera-button');
//const uploadBtn = document.getElementById('menu-upload-button');
//const logoEl = document.querySelector('.logo');

// main photobooth frame animation
const loadedFrames = PHOTOBOOTH_FRAMES.map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

let currentFrame = 0;
let direction = 1;
let lastFrameTime = 0;

function animatePhotobooth(timestamp) {
    if (!photoboothEl) return;

    if (timestamp - lastFrameTime >= PHOTOBOOTH_FRAME_INTERVAL) {
        const frame = loadedFrames[currentFrame];
        if (frame.complete) {
            photoboothEl.style.backgroundImage = `url('${frame.src}')`;
            photoboothEl.style.transition = 'opacity 0.15s';
            photoboothEl.style.opacity = 1;

            currentFrame += direction;
            if (currentFrame >= loadedFrames.length - 1) {
                return;
                //currentFrame = 0;  從頭開始再來
            }
            lastFrameTime = timestamp;
        }
    }
    requestAnimationFrame(animatePhotobooth);
}

requestAnimationFrame(animatePhotobooth);


function addSafeNavigation(button, url) { //id
    if (!button) return;

    button.addEventListener('click', e => {
        e.preventDefault();
        setTimeout(() => {
            window.location.href = url;
        }, 100);
    });
}

// animation for select button
if (enterButton) {
    ['mouseenter', 'mousedown'].forEach(evt =>
        enterButton.addEventListener(evt, () => {
            denimalzEl_1.classList.add('is-active');
            denimalzEl_2.classList.add('is-active');
        })
    );
    ['mouseleave', 'mouseup'].forEach(evt =>
        enterButton.addEventListener(evt, () => {
            denimalzEl_1.classList.remove('is-active');
            denimalzEl_2.classList.remove('is-active');
        })
    );

}

// add more safe nav
addSafeNavigation(enterButton, 'frame-menu.html');
