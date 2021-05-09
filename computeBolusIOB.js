const result = require('dotenv').config();
require('json.date-extensions');
JSON.useDateParser();

const fs = require('fs');

const entries = require('./files/entries.json');
var json = JSON.stringify(entries);
var date2 = JSON.parseWithDate(json);
//console.log(entries);

let insulin = date2.filter(e => e.insulin).map(e => ({ time: e.created_at, insulin: e.insulin}));
console.log('this is the filtered treatments (insulin):',insulin);
console.log('length',insulin.length) // returns the number of boluses or lenghth of the array

// dia is the duration of insulin action in hours
var dia = parseInt(process.env.DIA);
// td is the total duration of insulin action in minutes
var td = dia * 60;
// tp is the time to the peak insulin action in minutes
var tp = parseInt(process.env.TP);



var tau = tp * (1 - tp / td) / (1 - 2 * tp / td);
var a = 2 * tau / td;
var S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));

var activityContrib = 0;
var iobContrib = 0;

var moment = require('moment'); 
const { i, typeOf } = require('mathjs');
mealTimeBolus = insulin.map(entry => ({ ...entry, time:moment(entry.time).valueOf()}));
timeSinceBolusMin = insulin.map(entry => ({ ...entry, time: (Date.now() - moment(entry.time).valueOf())/(1000*60)}));
console.log('this is the trimmed down insulin and time since injection data:',timeSinceBolusMin);

let timeSinceBolusAct = insulin.map(entry => {
    var t = (Date.now() - moment(entry.time).valueOf())/(1000*60);
    var dose = entry.insulin;
    return { ...entry, time: t, activityContrib:  dose * (S / Math.pow(tau, 2)) * t * (1 - t / td) * Math.exp(-t / tau), iobContrib : dose * (1 - S * (1 - a) * ((Math.pow(t, 2) / (tau * td * (1 - a)) - t / tau - 1) * Math.exp(-t / tau) + 1)) };
 });
//console.log(timeSinceBolusAct);

let lastInsulins = timeSinceBolusAct.filter(function (e) {
    return e.time <= 300;
});
console.log('these are the last insulins and activities:',lastInsulins);

var resultAct = lastInsulins.reduce(function(tot, arr) { 
    return tot + arr.activityContrib;
  },0);
var resultIob = lastInsulins.reduce(function(tot, arr) { 
    return tot + arr.iobContrib;
  },0);

console.log(resultAct,resultIob);


const dataMealtimearr = [resultAct,resultIob];
const dataMealtime = JSON.stringify(dataMealtimearr, null, 4);
fs.writeFile('./files/last_mealtime.json', dataMealtime, (err) => {
  if (err) {
      throw err;
  }
  console.log("JSON mealtime insulin data is saved.");
});