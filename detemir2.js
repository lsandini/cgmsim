const dotenv = require('dotenv');
var result = require('dotenv').config();
require('json.date-extensions');
JSON.useDateParser();
var resultDetAct = 0;
const weight = parseInt(process.env.WEIGHT);
const detemirs = require('./files/last_detemir.json');
var jsondet = JSON.stringify(detemirs);
var detemir_data = JSON.parseWithDate(jsondet);
console.log(detemir_data);

// activities be expressed as U/min !!!
let timeSinceDetemirAct = detemir_data.map(entry => {
    var time = entry.time;
    var dose = entry.dose;
    var duration = (14 + (24*dose/weight));
    var peak = (duration/3);
    var tp = peak;
    var td = duration;
    var t = (Date.now() - moment(entry.time).valueOf())/(1000*60*60);
    var tau = tp * (1 - tp / td) / (1 - 2 * tp / td);
    var a = 2 * tau / td;
    var S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));

    var detemirActivity = 0;

    return { ...entry, time: time, detemirActivity:  dose * (S / Math.pow(tau, 2)) * t * (1 - t / td) * Math.exp(-t / tau)};
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
