const dotenv = require('dotenv');
var result = require('dotenv').config();
require('json.date-extensions');
JSON.useDateParser();
var resultDetAct = 0;
const weight = parseInt(process.env.WEIGHT);
const detemirs = require('./files/last_detemir.json');
var jsondet = JSON.stringify(detemirs);
var detemir_data = JSON.parseWithDate(jsondet);
var moment = require('moment');
console.log(detemir_data);

// activities be expressed as U/min !!!
let timeSinceDetemirAct = detemir_data.map(entry => {
    var time = entry.time;
    var dose = entry.dose;
    var duration = (14 + (24*dose/weight));
    var peak = (duration/3);
    var tp = peak;
    var td = duration;

    var tau = tp * (1 - tp / td) / (1 - 2 * tp / td);
    var a = 2 * tau / td;
    var S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));

    var detemirActivity = 0;

    return { ...entry,
         time: time,
         dose:dose,
         detemirActivity:  (dose * (S / Math.pow(tau, 2)) * time * (1 - time / td) * Math.exp(-time / tau) / 60),
         tp:tp,
         td:td
                };
});
console.log('these are the detemir activities:',timeSinceDetemirAct);
// compute the aggregated activity of last detemirs in 30 hours

let lastDetemirs = timeSinceDetemirAct.filter(function (e) {
    return e.time <= 30;
});
console.log('these are the last detemirs and activities:',lastDetemirs);

var resultDetAct = lastDetemirs.reduce(function(tot, arr) {
    return tot + arr.detemirActivity;
  },0);


console.log(resultDetAct);


const fs = require('fs');
const DetAct = JSON.stringify(resultDetAct, null, 4);
fs.writeFile('./files/last_detemir_aggrACT.json', DetAct, (err) => {
    if (err) {
        throw err;
    }
    console.log("aggregated DET activity is now is saved as JSON.");
  });



// LET'S UPLOAD STUFF TO DMPKL7
//===============================
var today = new Date();
var detDisplay = {"dateString" : today, "sgv" : Math.floor(resultDetAct * 1000 * 18), "type" : "sgv", "direction":"Flat", "date" : Date.now(),
};
var detDisplayString = JSON.stringify(detDisplay);

console.log('detDisplayString:',detDisplayString);

fs.writeFile("./files/detDisplayString.json", detDisplayString, function(err, result) {
if(err) console.log('error', err);
});

const fetch = require('node-fetch');
const crypto = require('crypto');


//let's build the API_secret for the headers and the API_url for the fetch() function
//===================================================================================
const api_url = "https://dmpkl7.herokuapp.com/api/v1/entries/"
;

const hash = crypto.createHash('sha1');
hash.update(process.env.APISECRET);
const hashed_secret = hash.digest('hex');

// now the fetch function itself
//==============================
const headers = {
    'Content-Type': 'application/json',
    'api-secret': hashed_secret
};

const body = detDisplayString;

//console.log(body_json);

fetch(api_url, {
    method: 'POST',
    headers: headers,
    body: body,
});

