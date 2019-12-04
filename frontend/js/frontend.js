const videoElements = document.querySelector('.flex-container');

async function getPrograms(section) {
    const data = await fetch(`http://localhost:3000/api/svt/program/${section}`, {
        cache: 'no-store',
    });
    const resp = await data.json();
    return resp;
}

async function getVideoId(id) {
    const data = await fetch(`http://localhost:3000/api/svt/getVideoId/${id}`, {
        cache: 'no-store',
    });
    const resp = await data.json();
    return resp;
}

async function getm3u8Link(id) {
    const data = await fetch(`http://localhost:3000/api/svt/m3u8/${id}`, {
        cache: 'no-store',
    });
    const resp = await data.json();
    return resp;
}

function getThumbnail(url) {
    return url.replace(/140/, /500/);
}

function createDiv(parent, video) {
    const name = document.createElement('a');
    const id = document.createElement('p');
    const img = document.createElement('img');
    const link = document.createElement('a');

    parent.append(link);

    link.append(img);
    link.append(name);
    link.append(id);

    link.href = '#';
    img.setAttribute('src', getThumbnail(video[1]));
    img.className = 'thumbnail';
    name.textContent = video[0].replace(/\\\//g, '/');
    name.className = 'videoname';
    id.className = 'svtId';
    id.textContent = video[2];
}

function drawPopular(video) {
    console.log(video[0]);
    for (let i = 0; i < 50; i += 1) {
        console.log(video[i]);
        const videoElement = document.createElement('div');
        videoElements.append(videoElement);
        videoElement.className = 'media';
        createDiv(videoElement, video[i]);
    }
}

window.addEventListener('keydown', (e) => {
    const evtobj = window.event ? event : e;
    console.log(evtobj.ctrlKey);
    if (evtobj.ctrlKey && evtobj.keyCode == 39) window.history.back();
});

getPrograms('populart')
    .then((json) => drawPopular(json))
    .then(() => {
        const playVideo = document.querySelectorAll('div.media > a');
        console.log(playVideo);
        playVideo.forEach((e) =>
            e.addEventListener('click', () => {
                getVideoId(e.lastChild.textContent)
                    .then((r) => getm3u8Link(r.svtVideoId))
                    .then((r) =>
                        window.location.assign(`./electron/videoplayer.html?url=${r.m3u8}`),
                    )
                    .catch((err) => console.error(err));
            }),
        );
    });
