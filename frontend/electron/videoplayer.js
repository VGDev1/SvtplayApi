/* eslint-disable */

(function createHlsPlayer() {
    // const url =
    'https://svt-vod-9j.akamaized.net/d0/se/20191108/38320599-0021-4b80-8df5-070b08ce29c0/master.m3u8?alt=https%3A%2F%2Fswitcher.cdn.svt.se%2F38320599-0021-4b80-8df5-070b08ce29c0%2Fmaster.m3u8'; // new URLSearchParams(window.location.search).get('url');
    const video = document.getElementById('video');
    console.log(url);
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play();
        });
    }
    // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
    // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element through the `src` property.
    // This is using the built-in support of the plain video element, without using hls.js.
    // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
    // white-list before a 'canplay' event will be emitted; the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
        video.addEventListener('loadedmetadata', () => {
            video.play();
        });
    }
})();
