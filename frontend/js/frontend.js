const videoElements = document.querySelector('.flex-container');

async function getPrograms(section) {
    console.log(section);
    const data = await fetch(`http://localhost:3000/api/svt/program/${section}`);
    const resp = await data.json();
    return resp;
}

async function getVideoId(id) {
    const data = await fetch(`http://localhost:3000/api/svt/getVideoId/${id}`);
    const resp = await data.json();
    return resp;
}

async function getm3u8Link(id) {
    const data = await fetch(`http://localhost:3000/api/svt/m3u8/${id}`);
    const resp = await data.json();
    return resp;
}

async function getEpisodes(slug) {
    const data = await fetch(`http://localhost:3000/api/svt/episodes/${slug}`);
    const resp = await data.json();
    return resp;
}

function createDiv(parent) {
    const link = document.createElement('a');
    parent.append(link);
    link.href = '#';
    return link;
}

function setThumbnail(data) {
    const img = document.createElement('img');
    img.setAttribute('src', data.thumbnail);
    img.className = 'thumbnail';
    return img;
}

function setTitle(data) {
    const title = document.createElement('a');
    title.textContent = data.name.replace(/\\\//g, '/');
    title.className = 'videoname';
    return title;
}
function setDesc(desc, data) {}

function miscData(data) {
    const svtId = document.createElement('p');
    const slug = document.createElement('p');
    svtId.className = 'svtId';
    svtId.textContent = data.svtId;
    slug.className = 'slug';
    slug.textContent = data.slug;
    return [svtId, slug];
}

function createCompleteDiv(parent, data) {
    const subparent = createDiv(parent);
    const thumbnail = setThumbnail(data);
    const title = setTitle(data);
    const misc = miscData(data);
    subparent.append(thumbnail, title, misc[0], misc[1]);
}

function drawPopular(video) {
    for (let i = 0; i < 50; i += 1) {
        console.log(video.program[i]);
        const videoElement = document.createElement('div');
        videoElements.append(videoElement);
        videoElement.className = 'media';
        createCompleteDiv(videoElement, video.program[i]);
    }
}

window.addEventListener('keydown', (e) => {
    const evtobj = window.event ? event : e;
    console.log(evtobj.ctrlKey);
    if (evtobj.ctrlKey && evtobj.keyCode == 39) window.history.back();
});
// console.log(window.location.pathname);
document.onreadystatechange = async () => {
    getPrograms('populart').then((r) => drawPopular(r));
    if (document.readyState === 'interactive') {
        console.log('hej');
    } else if (document.readyState == 'complete') {
    }
};
const playVideo = document.querySelectorAll('div.media > a');
console.log(playVideo);
playVideo.forEach((e) =>
    e.addEventListener('click', () => {
        if (e.lastElementChild.textContent !== 'program') {
            // then get slug api endpoint
        } else getVideoId(e.lastElementChild);
    }),
);
