const fetch = require('node-fetch');
const dotenv = require('dotenv');
var result = require('dotenv').config();

const api_url = process.env.API_SGV2;
const api_key = process.env.API_KEY;

// dates in ISO format
const now = Date.now();
const fiveMinAgo = now - 60000;
const tenMinAgo = now - 120000;
console.log(now, fiveMinAgo, tenMinAgo);

// dates in UNIX format 
const minutesToRemove = 5;
const currentDate = new Date();
const minus5Date = new Date(currentDate.getTime() - minutesToRemove * 60000);
const minus10Date = new Date(currentDate.getTime() - minutesToRemove * 120000);

console.log(currentDate, minus5Date, minus10Date);



const url = api_url;
const headers = {
    'Content-Type': 'application/json',
    'api-secret': api_key
};
const first_sgv = { "dateString": now, "sgv": 90, "type": "sgv", "direction": "Flat", "date": currentDate, "mills": currentDate };
const first_sgv_json = JSON.stringify(first_sgv);
console.log(first_sgv_json);

fetch(url, {
    method: 'POST',
    headers: headers,
    body: first_sgv_json
});


const headers1 = {
    'Content-Type': 'application/json',
    'api-secret': api_key
};
const fiveMin_sgv = { "dateString": fiveMinAgo, "sgv": 90, "type": "sgv", "direction": "Flat", "date": minus5Date, "mills": minus5Date };
const fiveMin_sgv_json = JSON.stringify(fiveMin_sgv);
console.log(fiveMin_sgv_json);

fetch(url, {
    method: 'POST',
    headers: headers1,
    body: fiveMin_sgv_json
});


const headers2 = {
    'Content-Type': 'application/json',
    'api-secret': api_key
};
const tenMin_sgv = { "dateString": tenMinAgo, "sgv": 90, "type": "sgv", "direction": "Flat", "date": minus10Date, "mills": minus10Date };
const tenMin_sgv_json = JSON.stringify(tenMin_sgv);
console.log(tenMin_sgv_json);

fetch(url, {
    method: 'POST',
    headers: headers2,
    body: tenMin_sgv_json
});
