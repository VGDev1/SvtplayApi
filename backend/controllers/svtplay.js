const fetch = require('node-fetch');

const getURL = async (apiurl) => {
    const data = await fetch(`http://127.0.0.1:8080/${apiurl}`, { headers: { 'x-requested-with': 'api' } });
    const resp = await data.json();
    return resp;
};

exports.getURL = getURL;
