

const frameButtons = document.querySelectorAll('.frame-button')

frameButtons.forEach(button => {
    button.addEventListener('click', e => {
        console.log('按鈕被點擊了！ID 是：', button.id);
        e.preventDefault();

        // 取得該按鈕的 id (例如 'frame-1')
        const frameId = button.id;

        // 使用 / 開頭代表從網站根目錄出發，並明確加上 .html
        const targetUrl = `/action.html?frame_id=${frameId}`;

        window.location.href = targetUrl;

        //setTimeout(() => {
        //    window.location.href = "/action.html?frame_id=" + frameId;
        //}, 100);

    })
})

// header redirect
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    if (header) header.addEventListener('click', () => window.location.href = 'index.html');
});
