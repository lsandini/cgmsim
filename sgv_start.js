const dotenv = require('dotenv');
var result = require('dotenv').config();
var moment = require('moment'); 
var fs = require('fs');
const fetch = require('node-fetch');


const sgvs = require('./files/sgv1.json');

var jsonsgvs = JSON.stringify(sgvs);
var sgvValues = JSON.parse(jsonsgvs);
console.log(sgvValues);



const ISF = parseInt(process.env.ISF)  //mmol/l/U
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

var DEG = require('./files/last_degludec_aggrACT.json');
var jsonDEG = JSON.stringify(DEG);
var degAct = JSON.parse(jsonDEG);

var TOU = require('./files/last_toujeo_aggrACT.json');
var jsonTOU = JSON.stringify(TOU);
var touAct = JSON.parse(jsonTOU);

// ENABLE THIS FOR PUMP SIMULATION
//=================================
// var pumpAct = require('./files/pumpBasalAct.json');
// var jsonPumpAct = JSON.stringify(pumpAct);
// var pumpBasalAct = JSON.parse(jsonPumpAct);

let globalBasalAct = glaAct + detAct + touAct + degAct;
let globalMealtimeAct = NRAct[0];

let globlalInsulinAct = globalBasalAct + globalMealtimeAct;

let BGI_ins = globlalInsulinAct * ISF * -90;

var today = new Date();



// here is the liver BG impact
const liver = require('./files/latest_liver.json');
console.log('liver: ', liver);
const liver_bgi = liver;
// var rnd = (Math.random() * (1.5 - 0.5) + 0.6);
//var liver_bgi = rnd * 0.0833;
// var liver_bgi = rnd * 0.12;



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


// START OF PLANETS SECTION
//==========================
const planets = require('./files/forceVectors.json');
 // the traction of planets is about 0.0015 (Newtons), add 1 !
let planetFactorA = 1 + planets.tractionSubject;
 // make the inverted dispersion a conjunction factor:
let conjunctionFactor = 1 + (planets.globalVectorLong_p_SDnorm1 / 1000);

 // apply the correction due to inverted dispersion;
let planetFactor = planetFactorA * conjunctionFactor;

console.log('planet traction force:', planets.tractionSubject);
console.log('planetFactorA is 1 + traction force:', planetFactorA);
console.log('normalized inverted SD of longitude dispersion:', planets.globalVectorLong_p_SDnorm1);
console.log('conjunction factor:', conjunctionFactor);
console.log('planetFactorA * conjunction or planetFactor:', planetFactor);


 // the illumination fraction if the moon varies from 0 to 1, divide by 10 and add 1 !

let moonFactor = ((planets.moon_illumination_fraction)/120) + 1 ;
console.log('moonFactor:', moonFactor);

// END OF PLANETS SECTION
//==========================



//WITH PUMP
//==========
// var sgv_pump = Math.floor(sgvValues[0].sgv + pumpBasalAct + BGI_ins + (liver_bgi * 18) + (carbs * 18) + (lastPerls[0].noise * 18 *6));
// var limited_sgv_pump = sgv_pump;
// if (sgv_pump >= 400) {
//     limited_sgv_pump = 400;}
//     else if (sgv_pump <=40) {
//         limited_sgv_pump = 40;
// };
// var dict = {"dateString" : today, "sgv" : limited_sgv_pump, "type" : "sgv", "direction": arrowValues[0].direction, "date" : Date.now(), 
//      };
// var dictstring = JSON.stringify(dict);



//WITHOUT PUMP
//============
var variation = (sgvValues[0].sgv + BGI_ins + (liver_bgi * 18) + (carbs * 18) + (lastPerls[0].noise * 18 *6));
var planetAndMoon = planetFactor * moonFactor;
var variationPlanets = variation * planetFactor * moonFactor;

console.log('previous SGV:',sgvValues[0].sgv);
console.log('new deviation:', BGI_ins + (liver_bgi * 18) + (carbs * 18) + (lastPerls[0].noise * 18 *6));
console.log('new SGV without planets:',variation);
console.log('planetAndMoon factor:', planetAndMoon);
console.log('new SGV with planets:',variationPlanets);

// SELECT VARIATION WITH OR WITHOUT PLANETS
//=========================================
var sgv_no_pump = Math.floor(variationPlanets); //with planets
//var sgv_no_pump = Math.floor(variation); //without planets;



var limited_sgv_no_pump = sgv_no_pump;
if (sgv_no_pump >= 400) {
    limited_sgv_no_pump = 400;}
    else if (sgv_no_pump <=40) {
        limited_sgv_no_pump = 40;
};
var dict = {"dateString" : today, "sgv" :  limited_sgv_no_pump, "type" : "sgv", "direction": arrowValues[0].direction, "date" : Date.now(), 
     };
var dictstring = JSON.stringify(dict);


fs.writeFile("./files/cgmsim-sgv.json", dictstring, function(err, result) {
    if(err) console.log('error', err);
});


console.log('-------------------------------------------');
console.log('glaAct:',glaAct,'detAct:',detAct,'touAct',touAct,'degAct',degAct,'total basal act:', globalBasalAct);
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

//console.log('this is the pump basal insulin activity:', pumpBasalAct);
