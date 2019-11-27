
const program_url =
  "https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=ProgramsListing&variables=%7B%22legacyIds%22%3A%5B24186554%5D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%221eeb0fb08078393c17658c1a22e7eea3fbaa34bd2667cec91bbc4db8d778580f%22%7D%7D";
const program_url_simple =
  "https://www.svtplay.se/api/search_autocomplete_list";


async function getURL(apiurl) {
    const data = await fetch(`http://127.0.0.1:8080/${apiurl}`, { headers: { 'x-requested-with': 'api' } });
    const resp = await data.json();
    return resp;
  }

function createSimpleJson(json) {
  let data = { program: [] };
  for (let i = 0; i < json.length; i++) {
    data.program.push(
      json[i].title,
      json[i].popularity,
      json[i].thumbnail
    ); 
  }
  return data;
  }


function createMostPopularAdvanced(Simple, Advanced) {
  return null;
}

const json = getURL(program_url_simple).then(d => createSimpleJson(d));
console.log(json);

