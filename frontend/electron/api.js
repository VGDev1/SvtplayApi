async function getPrograms(section) {
    const data = await fetch(`http://localhost:3000/api/svt/program/${section}`);
    const resp = await data.json();
    return resp;
}
getPrograms('AO').then((d) => console.log(d));
