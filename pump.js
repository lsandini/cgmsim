const fs = require('fs');
const { floor } = require('mathjs');
const profile = require('./files/profile.json');
const pump_treatments = require('./files/entries.json');
var moment = require('moment'); 


// here we start gathering the tempBasals from the default profile.json file
//==========================================================================

const list1 = profile.filter(e => e._id).map(e => ({_id: e._id, defaultProfile: e.defaultProfile, store: e.store, startDate: e.startDate, mills: e.mills, units: e.units, created_at: e.created_at}));
console.log(list1);

let lastlist1 = list1.filter(function (e) {
    return e.mills >= (Date.now()-86400000);
});
//console.log('this is the latest profiles in the 24 h:',lastlist1);

const profileDefault = lastlist1.map(entry => entry.store).map(entry => ({ Default: entry.Default }));
//console.log('latest Default profile:', profileDefault);

const basalProfileDefArr = profileDefault.map(entry => entry.Default).map(entry => ({ basal: entry.basal}));
//console.log('this is the array of basal in Default profile:', basalProfileDefArr);

const defaultProfile = basalProfileDefArr.map(entry => entry.basal);
console.log('this is the latest Default profile details:', defaultProfile);

const profileAutoSync = lastlist1.map(entry => entry.store).map(entry => ({ OpenAPS_Autosync: entry['OpenAPS Autosync'] }));
//console.log('latest AutoSync profile:', profileAutoSync);

const basalProfileAutoSyncArr = profileAutoSync.map(entry => entry.OpenAPS_Autosync).map(entry => ({ basal: entry.basal}));
//console.log('this is the array of basal in AutoSync profile:', basalProfileAutoSyncArr);

const autoSyncProfiles = basalProfileAutoSyncArr.map(entry => entry.basal);
console.log('this is the latest AutoSync profile details:', autoSyncProfiles);


const autoSyncProfile_z = autoSyncProfiles[0];
//var autoSyncProfile = autoSyncProfile_z.map(entry => ({ ...entry, time: parseFloat(entry.time), value: parseFloat(entry.value), timeAsSeconds: parseInt(entry.timeAsSeconds.slice(0))}));
var autoSyncProfile = autoSyncProfile_z.map(entry => ({ ...entry, time: parseFloat(entry.time), value: parseFloat(entry.value), timeAsSeconds: parseInt(entry.timeAsSeconds)}));
console.log('this is the trimmed down insulin and time since injection data:',autoSyncProfile); 




// here we start gathering the tempBasals from the treatment.json file
//====================================================================

const allTempBasals = pump_treatments.filter(e => e._id).map(e => ({duration: e.duration, timestamp: e.timestamp, absolute: e.absolute, eventType: e.eventType, created_at: e.created_at, mills: e.mills}));

let tempBasals = allTempBasals.filter(function (e) {
    return e.mills >= (Date.now()-10800000); // temps basals set in the last 3 hours
});
//console.log('these are the tempBasals from the last 3 hours:', tempBasals);

let tempBasals2 = tempBasals.filter(function (e) {
    return e.eventType = 'Temp Basal'; // temps basals set in the last 3 hours
});
console.log('these are the filtered tempBasals from the last 3 hours:', tempBasals2);

let tempBasals3 = tempBasals2.filter(function (e) {
    return e.duration != 0; // temps basals set in the last 3 hours
});
console.log('these are the filtered tempBasals from the last 3 hours:', tempBasals3);




// Now let's start to compute the insulin from profile first and temp basals
//==========================================================================
let days = (Date.now() / 86400000);
let relativeTimeOfDay = (days - Math.floor(days)) * 24 + 3;
if (relativeTimeOfDay > 24) {relativeTimeOfDay = (relativeTimeOfDay-24)};
let relativeTimeOfDaySecs = ((days - Math.floor(days)) * 24 + 3) * 60 * 60;

console.log('relative time of day since midnight in UTC time + 3h in hours:', relativeTimeOfDay);
console.log('relative time of day since midnight in UTC time + 3h in seconds:', relativeTimeOfDaySecs);


// let's detect the current basal from Autosync profile (TO DO : also minutes !)
//==============================================================================
const j = floor(relativeTimeOfDay);
console.log(j);
var currentAutoSyncBasal = autoSyncProfile[j].value;
console.log('current basal according to AutoSync profile', currentAutoSyncBasal);

// let's detect the current basal from Temp Basals
//================================================
const k = tempBasals3[0];
var tempBasalEnd = tempBasals3[0].mills + tempBasals3[0].duration * 60 * 1000;
var tempBasal = tempBasals3[0].absolute;
console.log('current Temp Basal entry:',k);



// if a temp basal is set, override the AutoSync Basal 
//====================================================
if (Date.now() < tempBasalEnd) {
    var currentTempBasal = tempBasal;
} else {
    currentTempBasal = currentAutoSyncBasal;
};
console.log('This is the final value for the basal rate now:',currentTempBasal);


// let's compute a delivery of 5 minutes of current basal, as if it were a 
// bolus, then create an array of data similar to the "entries.json" file
//========================================================================

const basalAsBoluses_raw = require('./files/basalAsBoluses.json');
console.log('this is the retrieved json:', basalAsBoluses_raw);

let basalAsBoluses = basalAsBoluses_raw.filter(function (e) {
    return e.time >= (Date.now()-10800000); // only entries from the last 3 hours
});

let value = { 'time': Date.now(), 'insulin' : currentTempBasal/12 }
basalAsBoluses.unshift(value);
console.log('new bolusAsBoluses to be saved', basalAsBoluses);

const new_babValues = JSON.stringify(basalAsBoluses, null, 4);

fs.writeFile('./files/basalAsBoluses.json', new_babValues, (err) => {
    if (err) {
        throw err;
    }
});


var dia = process.env.DIA;
var td = dia * 60;
var tp = process.env.TP;
var tau = tp * (1 - tp / td) / (1 - 2 * tp / td);
var a = 2 * tau / td;
var S = 1 / (1 - a + (1 + a) * Math.exp(-td / tau));

var activityContrib = 0;


let timeSincePumpAct = basalAsBoluses.map(entry => {
    var t = (Date.now() - entry.time)/(1000*60);
    var dose = entry.insulin;
    return { ...entry, time: t, activityContrib:  dose * (S / Math.pow(tau, 2)) * t * (1 - t / td) * Math.exp(-t / tau) };
 });

console.log('basal as boluses with detailed activities:', timeSincePumpAct);



let lastPumpInsulins = timeSincePumpAct.filter(function (e) {
    return e.time <= (dia*60*1000);
});
console.log('these are the last pump basal insulins and detailed activities:',lastPumpInsulins);


var resultPumpAct = lastPumpInsulins.reduce(function(tot, arr) { 
    return tot + arr.activityContrib;
  },0);
console.log('this is the aggregated insulin activity from pump basal in the last dia hours:',resultPumpAct);


const pumpBasalAct = JSON.stringify(resultPumpAct, null, 4);
console.log('the pump´s basal activity is:', pumpBasalAct);
fs.writeFile('./files/pumpBasalAct.json', pumpBasalAct, (err) => {
    if (err) {
        throw err;
    }
    console.log("Pump basal activity is now is saved as JSON.");
  });



