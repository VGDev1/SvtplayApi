function checkTime(i) {
  // eslint-disable-next-line no-param-reassign
  if (i < 10) i = `0${i}`; // add zero in front of numbers < 10
  return i;
}

function clock() {
  const today = new Date();
  let hr = today.getHours();
  let min = today.getMinutes();
  let sec = today.getSeconds();
  hr = checkTime(hr);
  min = checkTime(min);
  sec = checkTime(sec);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const days = ['Sön', 'Mån', 'Tis', 'Ons', 'Tors', 'Fre', 'Lör'];
  const curWeekDay = days[today.getDay()];
  const curDay = today.getDate();
  const curMonth = months[today.getMonth()];
  const curYear = today.getFullYear();
  const date = `${curWeekDay}, ${curDay} ${curMonth} ${curYear} `;
  document.getElementById('clock').innerHTML = `${date + hr}:${min}:${sec} `;
  setTimeout(() => { clock(); }, 500);
}

$('document').ready(() => {
  clock();
});
