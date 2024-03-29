const dotenv = require('dotenv');
var result = require('dotenv').config();

const ISF = parseInt(process.env.ISF);
const CR = parseInt(process.env.CR);
console.log('ISF:',ISF,'CR:',CR);

// the sinus and cosinus numbers vary around 1, from 0.5 to 1.5:
// sin starts at 1.0 at midnight, is max at 6AM, is again 1 at 12 AM, and minimums at 0.5 a 6 PM
// cosin starts at 1.5 at midnight, is 1 at 6AM, is minimus at 0.5 12 AM, and is 1 again at 6 PM

const sinusdata = require('./files/sinuscurves.json');
const sinus = sinusdata.sinus;
const cosinus = sinusdata.cosinus;
console.log('sinus: ', sinus);
console.log('cosinus: ', cosinus);


// let's simulate the carb impact of the liver, producing 10g of carbs / hour
// if the ISF is 2 mmol/l/U,
// and the CR is 10g/U,
// => the the CF (carb factor) is 0.2 mmol/l/ 1g
// so the BG increases 2 mmol/l/h, (every time 10g of carbs are delivered)

// 0.2 mmol/l/h *10g /12 periods => bgi every 5 minutes or 0,166666 mmol/l/5min

// by multiplying the liver_bgi by the sin function, the liver loog glucose production varies in a sinusoidal
// form, being maximal at 6 AM and minimal ad 6 PM

const liver = (ISF/CR) * (10/12);
//const liver = 0.1666;
const liver_sin = liver * sinus;
console.log('liver: ', liver);
console.log('liver_sin: ', liver_sin);



let liverString = JSON.stringify(liver_sin);
const fs = require('fs');
fs.writeFile("./files/latest_liver.json", liverString, function(err, result) {
if(err) console.log('error', err);
});
