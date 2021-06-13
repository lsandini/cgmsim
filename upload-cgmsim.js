const fetch = require('node-fetch');
var result = require('dotenv').config();
const crypto = require('crypto');


//let's build the API_secret for the headers and the API_url for the fetch() function
//===================================================================================
const api_url = process.env.API_SGV2;

const hash = crypto.createHash('sha1');
hash.update(process.env.APISECRET);
const hashed_secret = hash.digest('hex');

// now the fetch function itself
//==============================
const headers = {
    'Content-Type': 'application/json',
    'api-secret': hashed_secret
};

const body = require('./files/cgmsim-sgv.json');
const body_json = JSON.stringify(body);
console.log(body_json);



fetch(api_url, {
    method: 'POST',
    headers: headers,
    body: body_json,
});