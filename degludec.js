const dotenv = require('dotenv');
var result = require('dotenv').config();
require('json.date-extensions');
JSON.useDateParser();
var resultDegAct = 0;
const { pi } = require("mathjs");

const weight = parseInt(process.env.WEIGHT);
var moment = require('moment');
const degludecs = require('./files/last_degludec.json');
var jsondeg = JSON.stringify(degludecs);
var degludec_data = JSON.parseWithDate(jsondeg);
console.log(degludec_data);

// activities be expressed as U/min !!!
let timeSinceDegludecAct = degludec_data.map(entry => {
    var time = entry.time;
    var dose = entry.dose;
    var duration = 42;
    var peak = (duration/3);
    var tp = peak;
    var td = duration;

    var tau = tp * (1 - tp / td) / (1 - 2 * tp / td);
    var a = 2 * tau / td;
    var S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));

    var degludecActivity = 0;
    return { ...entry,
         time: time,
         dose:dose,
         degludecActivity:  (dose * (S / Math.pow(tau, 2)) * time * (1 - time / td) * Math.exp(-time / tau)) / 60 };
});
console.log('these are the degludec activities:',timeSinceDegludecAct);

// compute the aggregated activity of last degludecs in 45 hours

let lastDegludecs = timeSinceDegludecAct.filter(function (e) {
    return e.time <= 45;
});
console.log('these are the last degludecs and activities:',lastDegludecs);

var resultDegAct = lastDegludecs.reduce(function(tot, arr) {
    return tot + arr.degludecActivity;
  },0);

console.log(resultDegAct);

const fs = require('fs');
const { duration } = require('moment');
const DegAct = JSON.stringify(resultDegAct, null, 4);
fs.writeFile('./files/last_degludec_aggrACT.json', DegAct, (err) => {
    if (err) {
        throw err;
    }
    console.log("aggregated DEG activity is now is saved as JSON.");
  });