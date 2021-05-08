const fetch = require('node-fetch');
const dotenv = require('dotenv');
var result = require('dotenv').config();
const { floor } = require('mathjs');
const profile = require('./files/profile.json');
const randomMeals = require('./files/randomMeals.json');
const sgv = require('./files/sgv.json');

const api_url = process.env.API_URL_TEST;
const api_key = process.env.API_KEY;

const fs = require('fs');
var moment = require('moment'); 

const list1 = profile.filter(e => e._id).map(e => ({_id: e._id, defaultProfile: e.defaultProfile, store: e.store, startDate: e.startDate, mills: e.mills, units: e.units, created_at: e.created_at}));
//console.log(list1);

let lastlist1 = list1.filter(function (e) {
    return e.mills >= (Date.now()-86400000);
});
//console.log('this is the latest profiles in the 24 h:',lastlist1);

console.log('----------------------------------------');

const profileDefault = lastlist1.map(entry => entry.store).map(entry => ({ Default: entry.Default }));
//console.log('latest Default profile:', profileDefault);
const sensProfileDefArr = profileDefault.map(entry => entry.Default).map(entry => ({ sens: entry.sens}));
//console.log('this is the array of sens in Default profile:', sensProfileDefArr);
const defaultSens_z = sensProfileDefArr.map(entry => entry.sens);
const defaultSens = defaultSens_z[0];
console.log('this is the latest sensitivity in Default profile details:', defaultSens);


const targetLowProfileDefArr = profileDefault.map(entry => entry.Default).map(entry => ({ target_low: entry.target_low}));
//console.log('this is the array of target_low in Default profile:', sensProfileDefArr);
const targetHighProfileDefArr = profileDefault.map(entry => entry.Default).map(entry => ({ target_high: entry.target_high}));
//console.log('this is the array of target_high in Default profile:', sensProfileDefArr);
const defaultTargetLow_z = targetLowProfileDefArr.map(entry => entry.target_low);
const defaultTargetLow = defaultTargetLow_z[0];
console.log('this is the latest low target in Default profile details:', defaultTargetLow);
const defaultTargetHigh_z = targetHighProfileDefArr.map(entry => entry.target_high);
const defaultTargetHigh = defaultTargetHigh_z[0];
console.log('this is the latest high target in Default profile details:', defaultTargetHigh);

const crProfileDefArr = profileDefault.map(entry => entry.Default).map(entry => ({ carbratio: entry.carbratio}));
//console.log('this is the array of carb ratios in Default profile:', crProfileDefArr);
const defaultCR_z = crProfileDefArr.map(entry => entry.carbratio);
const defaultCR = defaultCR_z[0];
console.log('this is the latest carb ratio in Default profile details:', defaultCR);

console.log('----------------------------------------');


const profileAutoSync = lastlist1.map(entry => entry.store).map(entry => ({ OpenAPS_Autosync: entry['OpenAPS Autosync'] }));
//console.log('latest AutoSync profile:', profileAutoSync);
const sensProfileAutoSyncArr = profileAutoSync.map(entry => entry.OpenAPS_Autosync).map(entry => ({ sens: entry.sens}));
//console.log('this is the array of sens in AutoSync profile:', sensProfileAutoSyncArr);
const autoSyncSens_z = sensProfileAutoSyncArr.map(entry => entry.sens);
const autoSyncSens = autoSyncSens_z[0];
console.log('this is the latest sensitivity AutoSync profile details:', autoSyncSens);


const targetLowProfileAutoSyncArr = profileAutoSync.map(entry => entry.OpenAPS_Autosync).map(entry => ({ target_low: entry.target_low}));
//console.log('this is the array of target_low in Autosync profile:', targetLowAutoSyncArr);
const targetHighProfileAutoSyncArr = profileAutoSync.map(entry => entry.OpenAPS_Autosync).map(entry => ({ target_high: entry.target_high}));
//console.log('this is the array of target_high in Autosync profile:', targetHighProfileAutoSyncArr);
const autoSyncTargetLow_z = targetLowProfileAutoSyncArr.map(entry => entry.target_low);
const autoSyncTargetLow = autoSyncTargetLow_z[0];
console.log('this is the latest low target in Autosync profile details:', autoSyncTargetLow);
const autoSyncTargetHigh_z = targetHighProfileAutoSyncArr.map(entry => entry.target_high);
const autoSyncTargetHigh = autoSyncTargetHigh_z[0];
console.log('this is the latest high target in Autosync profile details:', autoSyncTargetHigh);


const crProfileAutoSyncArr = profileAutoSync.map(entry => entry.OpenAPS_Autosync).map(entry => ({ carbratio: entry.carbratio}));
//console.log('this is the array of carb ratios in AutoSync profile:', crProfileAutoSyncArr);
const autoSyncCR_z = crProfileAutoSyncArr.map(entry => entry.carbratio);
const autoSyncCR = autoSyncCR_z[0];
console.log('this is the latest carb ratio AutoSync profile details:', autoSyncCR);

console.log('----------------------------------------');

let correctionBR = ((sgv[0].sgv/18) - defaultTargetHigh[0].value) / autoSyncSens[0].value;
let carbBolusBR = (randomMeals[0].carbs / defaultCR[0].value);
let totalBolusBR = (Math.round((correctionBR + carbBolusBR)*10))/10;;
console.log('correctionBR:',correctionBR, 'carbBolusBR:', carbBolusBR, 'totalBolusBR:',totalBolusBR);

let correctionLU = ((sgv[0].sgv/18) - defaultTargetHigh[0].value) / autoSyncSens[0].value;
let carbBolusLU = (randomMeals[1].carbs / defaultCR[0].value);
let totalBolusLU = (Math.round((correctionLU + carbBolusLU)*10))/10;;
console.log('correctionLU:',correctionLU, 'carbBolusLU:', carbBolusLU, 'totalBolusLU:',totalBolusLU);

let correctionSN = ((sgv[0].sgv/18) - defaultTargetHigh[0].value) / autoSyncSens[0].value;
let carbBolusSN = (randomMeals[2].carbs / defaultCR[0].value);
let totalBolusSN = (Math.round((correctionSN + carbBolusSN)*10))/10;
console.log('correctionSN:',correctionSN, 'carbBolusSN:', carbBolusSN, 'totalBolusSN:',totalBolusSN);

let correctionDI = ((sgv[0].sgv/18) - defaultTargetHigh[0].value) / autoSyncSens[0].value;
let carbBolusDI = (randomMeals[3].carbs / defaultCR[0].value);
let totalBolusDI = (Math.round((correctionDI + carbBolusDI)*10))/10;
console.log('correctionDI:',correctionDI, 'carbBolusDI:', carbBolusDI, 'totalBolusDI:',totalBolusDI);


let bolusBR = {
    time : Date.now(), 
    insulin : totalBolusBR, 
    eventType : 'Meal Bolus', 
    created_at : moment(Date.now()).toISOString(), 
    dateString : moment(Date.now()).toISOString(), 
    secret: api_key
};
const bolusBRString = JSON.stringify(bolusBR, null, 4);
console.log('this is the bolusBR:', bolusBRString);

let bolusLU = {
    time : Date.now(), 
    insulin : totalBolusLU, 
    eventType : 'Meal Bolus', 
    created_at : moment(Date.now()).toISOString(), 
    dateString : moment(Date.now()).toISOString(), 
    secret: api_key
};
const bolusLUString = JSON.stringify(bolusLU, null, 4);
console.log('this is the bolusBR:', bolusLUString);

let bolusSN = {
    time : Date.now(), 
    insulin : totalBolusSN, 
    eventType : 'Meal Bolus', 
    created_at : moment(Date.now()).toISOString(), 
    dateString : moment(Date.now()).toISOString(), 
    secret: api_key
};
const bolusSNString = JSON.stringify(bolusSN, null, 4);
console.log('this is the bolusBR:', bolusSNString);

let bolusDI = {
    time : Date.now(), 
    insulin : totalBolusDI, 
    eventType : 'Meal Bolus', 
    created_at : moment(Date.now()).toISOString(), 
    dateString : moment(Date.now()).toISOString(),
    secret: api_key
};
const bolusDIString = JSON.stringify(bolusDI, null, 4);
console.log('this is the bolusBR:', bolusDIString);


if (  ( (randomMeals[0].time) - Date.now() < (10 * 60 * 1000)) && ((randomMeals[0].time) - (Date.now()) > (5 * 60 * 1000))   ) {
fetch(api_url, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bolusBR),
  });
};

if (  ( (randomMeals[1].time) - Date.now() < (10 * 60 * 1000)) && ((randomMeals[1].time) - (Date.now()) > (5 * 60 * 1000))   ) {
    fetch(api_url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bolusLU),
      });
};

if (  ( (randomMeals[2].time) - Date.now() < (10 * 60 * 1000)) && ((randomMeals[2].time) - (Date.now()) > (5 * 60 * 1000))   ) {
    fetch(api_url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bolusSN),
      });
};

if (  ( (randomMeals[3].time) - Date.now() < (10 * 60 * 1000)) && ((randomMeals[3].time) - (Date.now()) > (5 * 60 * 1000))   ) {
    fetch(api_url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bolusDI),
      });
};

console.log('time to BR in min',((randomMeals[0].time) - Date.now())/60000);
console.log('time to LU in min',((randomMeals[1].time) - Date.now())/60000);
console.log('time to SN in min',((randomMeals[2].time) - Date.now())/60000);
console.log('time to DI in min',((randomMeals[3].time) - Date.now())/60000);
