const fetch = require('node-fetch');
const dotenv = require('dotenv');
var result = require('dotenv').config();

const api_url = process.env.API_SGV2;
const api_key = process.env.API_KEY;

var today = new Date();
var time = Date.now();
console.log(time, today);


const url = api_url;
const headers = {
    'Content-Type': 'application/json',
    'api-secret': api_key
};
const first_sgv = { "dateString": today, "sgv": 90, "type": "sgv", "direction": "Flat", "date": time, "mills": time };
const first_sgv_json = JSON.stringify(first_sgv);
console.log(first_sgv_json);

fetch(url, {
    method: 'POST',
    headers: headers,
    body: first_sgv_json});


