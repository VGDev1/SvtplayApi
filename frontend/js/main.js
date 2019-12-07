function checkTime(i) {
    // eslint-disable-next-line no-param-reassign
    if (i < 10) i = `0${i}`; // add zero in front of numbers < 10
    return i;
}

function date() {
    const today = new Date();
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tors', 'Fre', 'Lör'];
    const curWeekDay = days[today.getDay()];
    const curDay = today.getDate();
    const curMonth = months[today.getMonth()];
    const curYear = today.getFullYear();
    return `${curWeekDay}, ${curDay} ${curMonth} ${curYear} `;
}

function time() {
    const today = new Date();
    let hr = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();
    hr = checkTime(hr);
    min = checkTime(min);
    sec = checkTime(sec);
    return [hr, min, sec];
}

function clock() {
    document.getElementById('clock').innerHTML = `${date() + time()[0]}:${time()[1]}:${time()[2]} `;
    setTimeout(() => {
        clock();
    }, 500);
}

window.addEventListener('keydown', (e) => {
    const evtobj = window.event ? event : e;
    console.log(evtobj.ctrlKey);
    if (evtobj.ctrlKey && evtobj.keyCode == 39) window.history.back();
});

$('document').ready(() => {
    const path = window.location.pathname.split('/').pop();
    if (path === 'start.html') clock();
});
