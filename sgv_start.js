var result = require('dotenv').config();
var moment = require('moment'); 
var fs = require('fs');
const sgvs = require('./files/sgv1.json');
var jsonsgvs = JSON.stringify(sgvs);
var sgvValues = JSON.parse(jsonsgvs);
console.log(sgvValues);

const ISF = process.env.ISF  //mmol/l/U
console.log('ISF=',ISF);

var NR = require('./files/last_mealtime.json');
var jsonNR = JSON.stringify(NR);
var NRAct = JSON.parse(jsonNR);

var GLA = require('./files/last_glargine_aggrACT.json');
var jsonGLA = JSON.stringify(GLA);
var glaAct = JSON.parse(jsonGLA);

var DET = require('./files/last_detemir_aggrACT.json');
var jsonDET = JSON.stringify(DET);
var detAct = JSON.parse(jsonDET);

var pumpAct = require('./files/pumpBasalAct.json');
var jsonPumpAct = JSON.stringify(pumpAct);
var pumpBasalAct = JSON.parse(jsonPumpAct);

let globalBasalAct = glaAct + detAct;
let globalMealtimeAct = NRAct[0];

let globlalInsulinAct = globalBasalAct + globalMealtimeAct;

let BGI_ins = globlalInsulinAct * ISF * -90;

var today = new Date();

// here is the liver BG impact
// 1 mmol/l/h is 0.083333 mmol/l/5 min
var rnd = (Math.random() * (1.5 - 0.5) + 0.6);
//var liver_bgi = rnd * 0.0833;
var liver_bgi = rnd * 0.12;



// here is the impact of the latest carbs meal
const carbzz = require('./files/latest_carbs.json');
var jsoncarbzz = JSON.stringify(carbzz);
var carbs = JSON.parse(jsoncarbzz);
console.log(carbs);


const arrows = require('./files/arrows.json');
var jsonArrows = JSON.stringify(arrows);
var arrowValues = JSON.parse(jsonArrows);
console.log(arrowValues);



// ADD FUNCTION PERLIN NOISE HERE

const perls = require('./files/perlin.json');
var jsonperls = JSON.stringify(perls);
var perlValues = JSON.parse(jsonperls);

var timeSincePerlin = perlValues.map(entry => ({ ...entry, time: (Date.now() - moment(entry.time).valueOf())/(1000*60)}));
//console.log(perlValues);
//console.log(timeSincePerlin);

let lastPerls = timeSincePerlin.filter(function (e) {
    return e.time >=0 && e.time <= 5; // keep only the latest noise value
});
console.log('this is the last perlin noise value:', lastPerls);
console.log('this is the last perlin noise value:', lastPerls[0].noise);

// END OF PERLIN NOISE SECTION

var limited_sgv = sgvValues[0].sgv;

if (sgvValues[0].sgv >= 400) {
     limited_sgv = 400;}
    else if (sgvValues[0].sgv <=40) {
      limited_sgv = 40;
};


//WITH PUMP
//==========
// var dict = {"dateString" : today, "sgv" :  Math.floor(limited_sgv + pumpBasalAct + BGI_ins + (liver_bgi * 18) + (carbs * 18) + (lastPerls[0].noise * 18 *6)), "type" : "sgv", "direction": arrowValues[0].direction, "date" : Date.now(), 
//      };
// var dictstring = JSON.stringify(dict);

//WITHOUT PUMP
//============
var dict = {"dateString" : today, "sgv" :  Math.floor(limited_sgv + BGI_ins + (liver_bgi * 18) + (carbs * 18) + (lastPerls[0].noise * 18 *6)), "type" : "sgv", "direction": arrowValues[0].direction, "date" : Date.now(), 
     };
var dictstring = JSON.stringify(dict);




fs.writeFile("./files/cgmsim-sgv.json", dictstring, function(err, result) {
    if(err) console.log('error', err);
});


console.log('-------------------------------------------');
console.log('glaAct:',glaAct,'detAct:',detAct,'total basal act:', globalBasalAct);
console.log('-------------------------------------------');
console.log('total mealtime insulin activity:',globalMealtimeAct);
console.log('-------------------------------------------');
console.log('total insulin activity:',globlalInsulinAct);

console.log('-------------------------------------------');
console.log('total BG impact of insulin for 5 minutes:',BGI_ins,'mg/dl');
console.log('total BG impact of insulin for 5 minutes:',BGI_ins/18,'mmol/l');

console.log('-------------------------------------------');
console.log('total BG impact of liver for 5 minutes: +',liver_bgi,'mmol/l');

console.log('-------------------------------------------');
console.log('total BG impact of carbs for 5 minutes: +',carbs,'mmol/l');

console.log('-------------------------------------------');
console.log('total BG impact of carbs, liver and insulin for 5 minutes: +',(BGI_ins/18) + liver_bgi + carbs,'mmol/l');

console.log('this is the pump basal insulin activity:', pumpBasalAct);
