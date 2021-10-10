require('json.date-extensions');
JSON.useDateParser();
var resultGlaAct =0;
const { pi } = require("mathjs");

const dotenv = require('dotenv');
var result = require('dotenv').config();
const weight = parseInt(process.env.WEIGHT);

const glargines = require('./files/last_glargine.json');
var jsongla = JSON.stringify(glargines);
var glargine_data = JSON.parseWithDate(jsongla);
console.log(glargine_data);

// activities be expressed as U/min !!!
let timeSinceGlargineAct = glargine_data.map(entry => {

    var time = entry.time;
    var dose = entry.dose;
    var duration = (22 + (12*dose/weight));
    var peak = (duration/2.5);
    var tp = peak;
    var td = duration;

    var tau = tp * (1 - tp / td) / (1 - 2 * tp / td);
    var a = 2 * tau / td;
    var S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));

    var glargineActivity = 0;
    return { ...entry, time: time, glargineActivity:  (dose * (S / Math.pow(tau, 2)) * t * (1 - t / td) * Math.exp(-t / tau)) / 60 };

});
console.log('the is the accumulated glargine activity:', timeSinceGlargineAct);

// compute the aggregated activity of last glargines in 27 hours

let lastGlargines = timeSinceGlargineAct.filter(function (e) {
    return e.time <= 30;
});
console.log('these are the last glargines and activities:',lastGlargines);

var resultGlaAct = lastGlargines.reduce(function(tot, arr) { 
    return tot + arr.glargineActivity;
  },0);

console.log(resultGlaAct);

const fs = require('fs');
const { duration } = require('moment');
const GlaAct = JSON.stringify(resultGlaAct, null, 4);
fs.writeFile('./files/last_glargine_aggrACT.json', GlaAct, (err) => {
    if (err) {
        throw err;
    }
    console.log("aggregated GLA activity is now is saved as JSON.");
  });
