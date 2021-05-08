const fetch = require('node-fetch');
const dotenv = require('dotenv');
var result = require('dotenv').config();

const api_url = process.env.API_SGV2;
const api_key = process.env.API_KEY;

const headers = {
    'Content-Type': 'application/json',
    'api-secret': api_key
};

const body = require('./files/cgmsim-sgv.json');
const body_json = JSON.stringify(body);
console.log(body_json);

fetch(api_url, {
    method: 'POST',
    headers: headers,
    body: body_json,
});