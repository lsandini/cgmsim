const fetch = require('node-fetch');
const dotenv = require('dotenv');
var result = require('dotenv').config();

const api_url = process.env.API_SGV2;
const api_key = process.env.API_KEY;

console.log(process.env.API_SGV2, process.env.API_KEY);

// dates in ISO format
const now = Date.now();
const fiveMinAgo = now - 5*60000;
const tenMinAgo = now - 5*120000;
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
const first_sgv = { "dateString": currentDate, "sgv": 90, "type": "sgv", "direction": "Flat", "date": now, "mills": now };
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
const fiveMin_sgv = { "dateString": minus5Date, "sgv": 90, "type": "sgv", "direction": "Flat", "date": fiveMinAgo, "mills": fiveMinAgo };
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
const tenMin_sgv = { "dateString": minus10Date, "sgv": 90, "type": "sgv", "direction": "Flat", "date": tenMinAgo , "mills": tenMinAgo };
const tenMin_sgv_json = JSON.stringify(tenMin_sgv);
console.log(tenMin_sgv_json);

fetch(url, {
    method: 'POST',
    headers: headers2,
    body: tenMin_sgv_json
});
