
require('json.date-extensions');
JSON.useDateParser();

const fs = require('fs');

const entries = require('./files/entries.json');
var json = JSON.stringify(entries);
var notes = JSON.parseWithDate(json);
//console.log(notes);

let basal = notes.filter(e => e.notes).map(e => ({ time: e.created_at, notes: e.notes}));
console.log('this is the filtered treatments (basal):',basal);
console.log('length',basal.length) // returns the number of boluses or lenghth of the array

var moment = require('moment'); 
const { i, typeOf } = require('mathjs');
basals = basal.map(entry => ({ ...entry, time:moment(entry.time).valueOf()}));
timeSinceBasalMin = basals.map(entry => ({ ...entry, time: (Date.now() - moment(entry.time).valueOf())/(1000*60*60), drug: entry.notes.slice(0,3), dose: parseInt(entry.notes.slice(8), 10)}));
console.log('this is the trimmed down insulin and time since injection data:',timeSinceBasalMin);

let lastBasals = timeSinceBasalMin.filter(function (e) {
    return e.time <= 36; // keep only the basals from the last 36 hours
});
console.log('these are the last basals: ',lastBasals);

let lastGLA = lastBasals.filter(function (e) {
    return e.drug === 'gla' || e.drug === 'Gla' ; // keep only the glas from the last 36 hours
});
console.log('these are the last glargines: ',lastGLA);

let lastDET = lastBasals.filter(function (e) {
    return e.drug === 'det' || e.drug === 'Det' ; // keep only the dets from the last 36 hours
});
console.log('these are the last detemirs: ',lastDET);


const datadet = JSON.stringify(lastDET, null, 4);
const datagla = JSON.stringify(lastGLA, null, 4);



fs.writeFile('./files/last_detemir.json', datadet, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON detemir data is saved.");
});
fs.writeFile('./files/last_glargine.json', datagla, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON glargine data is saved.");
});

