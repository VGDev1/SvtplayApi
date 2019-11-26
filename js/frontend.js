const videoElements = document.querySelector('.flex-container');

async function gJson() {
  const r = await fetch('./myJson.json');
  const d = await r.json();
  return d;
}

function getThumbnail(url) {
  return url.replace(/140/, /500/);
}

function createDiv(parent, video) {
  const name = document.createElement('a');
  const id = document.createElement('p');
  const img = document.createElement('img');
  parent.append(img);
  parent.append(name);
  parent.append(id);

  img.setAttribute('src', getThumbnail(video[1][1]));
  img.className = 'thumbnail';
  name.textContent = video[0].replace(/\\\//g, '/');
  name.className = 'videoname';
}

function drawPopular(video) {
  console.log(video[0]);
  for (let i = 0; i < 50; i += 1) {
    console.log(video[i]);
    const videoElement = document.createElement('div');
    videoElements.append(videoElement);
    videoElement.className = 'media mb-3 mr-3';
    createDiv(videoElement, video[i]);
  }
}

gJson().then((json) => drawPopular(json));
