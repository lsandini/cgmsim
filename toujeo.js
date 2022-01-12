const dotenv = require('dotenv');
var result = require('dotenv').config();
require('json.date-extensions');
JSON.useDateParser();
var resultTouAct = 0;
const { pi } = require("mathjs");

const weight = parseInt(process.env.WEIGHT);
var moment = require('moment');
const toujeos = require('./files/last_toujeo.json');
var jsontou = JSON.stringify(toujeos);
var toujeo_data = JSON.parseWithDate(jsontou);
console.log(toujeo_data);

// activities be expressed as U/min !!!
let timeSinceToujeoAct = toujeo_data.map(entry => {

    var time = entry.time;
    var dose = entry.dose;
    var duration = (24 + (14*dose/weight));
    var peak = (duration/2.5);
    var tp = peak;
    var td = duration;

    var tau = tp * (1 - tp / td) / (1 - 2 * tp / td);
    var a = 2 * tau / td;
    var S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));

    var toujeoActivity = 0;
    return { ...entry,
         time: time,
         toujeoActivity:  (dose * (S / Math.pow(tau, 2)) * time * (1 - time / td) * Math.exp(-time / tau)) / 60 };
});
console.log('the is the accumulated toujeo activity:', timeSinceToujeoAct);

// compute the aggregated activity of last toujeos in 27 hours

let lastToujeos = timeSinceToujeoAct.filter(function (e) {
    return e.time <= 30;
});
console.log('these are the last toujeos and activities:',lastToujeos);

var resultTouAct = lastToujeos.reduce(function(tot, arr) {
    return tot + arr.toujeoActivity;
  },0);

console.log(resultTouAct);

const fs = require('fs');
const { duration } = require('moment');
const TouAct = JSON.stringify(resultTouAct, null, 4);
fs.writeFile('./files/last_toujeo_aggrACT.json', TouAct, (err) => {
    if (err) {
        throw err;
    }
    console.log("aggregated TOU activity is now is saved as JSON.");
  });
