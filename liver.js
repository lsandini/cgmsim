const fs = require('fs');
// let's simulate the carb inpact of the liver, producing 10g of carbs / hour
// if the ISF is 1 mmol/l/U,
// and the CR is 10g/U,
// => the the CF (carb factor) is 1 mmol/l/10g
// so the BG increases 1 mmol/l/h, (every time 10g of carbs are delivered)

// 1 mmol/l/h / (60min*60sec*1000) = 1/3'600'000 mmol/l/ms
// 1 mmol/l/h /12 = bgi every 5 minutes or 0,0833 mmol/l/5min


const sinusdata = require('./files/sinuscurves.json');
const sinus = sinusdata.sinus;
const cosinus = sinusdata.cosinus;
console.log('sinus: ', sinusdata.sinus);
console.log('cosinus: ', sinusdata.cosinus);

var liver_bgi = 0.0833;

let liverString = JSON.stringify(liver_bgi);
fs.writeFile("./files/latest_liver.json", liverString, function(err, result) {
if(err) console.log('error', err);
});