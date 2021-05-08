require('json.date-extensions');
JSON.useDateParser();
var resultGlaAct =0;
const { pi } = require("mathjs");

const glargines = require('./files/last_glargine.json');
const duration = 27;
var jsongla = JSON.stringify(glargines);
var glargine_data = JSON.parseWithDate(jsongla);
console.log(glargine_data);

// activities be expressed as U/min !!!
let timeSinceGlargineAct = glargine_data.map(entry => {

    var time = entry.time;
    var dose = entry.dose;
    return { ...entry, time: time, glargineActivity: (2 * Math.sqrt((Math.pow(((2*dose)/(Math.PI*duration)),2)) * (1 + (2 * (Math.pow((time-(duration/2)),2) / Math.pow(duration,2) ) ) ),2))/60 };

});
console.log('the is the accumulated glargine activity:', timeSinceGlargineAct);

// compute the aggregated activity of last glargines in 27 hours

let lastGlargines = timeSinceGlargineAct.filter(function (e) {
    return e.time <= 27;
});
console.log('these are the last glargines and activities:',lastGlargines);

var resultGlaAct = lastGlargines.reduce(function(tot, arr) { 
    return tot + arr.glargineActivity;
  },0);

console.log(resultGlaAct);

const fs = require('fs');
const GlaAct = JSON.stringify(resultGlaAct, null, 4);
fs.writeFile('./files/last_glargine_aggrACT.json', GlaAct, (err) => {
    if (err) {
        throw err;
    }
    console.log("aggregated GLA activity is now is saved as JSON.");
  });