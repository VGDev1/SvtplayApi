const program_url =
  "https://api.svt.se/contento/graphql?ua=svtplaywebb-play-render-prod-client&operationName=ProgramsListing&variables=%7B%22legacyIds%22%3A%5B24186554%5D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%221eeb0fb08078393c17658c1a22e7eea3fbaa34bd2667cec91bbc4db8d778580f%22%7D%7D";
const program_url_simple =
  "https://www.svtplay.se/api/search_autocomplete_list";

async function gJson(url) {
  const g = await fetch(url);
  const r = await g.json();
  return r;
}

function createMostPopularSimple(ObjectFile) {
  let data = { program: [] };
  for (let i = 0; i < ObjectFile.length; i++) {
    data.program.push(
      ObjectFile[i].title,
      ObjectFile[i].popularity,
      ObjectFile[i].thumbnail
    );
  }
  return data;
}

function createMostPopularAdvanced(Simple, Advanced) {
  return null;
}

const Json = gJson(program_url_simple);
const Simple_list = createMostPopularSimple(Json);
console.log(Json);
