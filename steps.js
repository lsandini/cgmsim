const fs = require('fs');
const mydata = require('./mydata.json');
const moment = require('moment');
const dotenv = require('dotenv');
var result = require('dotenv').config();
const fetch = require('node-fetch');
const api_url = process.env.API_URL;

//let's hash the APISECRET
const {
    createHash,
  } = require('crypto');
const { parseInt } = require('lodash');
  const hash = createHash('sha1');
  hash.update(process.env.APISECRET);
  //console.log(hash.digest('hex'));
  const hash_secret = hash.digest('hex');
  //console.log('this is the hashed secret:', hash_secret);

console.log('----------------------------------');

// now let's read mydata.json and the first object in the array (heart rates)
//===========================================================================
const heartRate_x = mydata.data.metrics[0].data;

const heartRate = heartRate_x.map(entry => ({
  notes: Math.round(entry.Avg), 
  glucose : Math.round(entry.Avg)/10, 
  created_at: Date.parse(entry.date).valueOf(), 
  dateString : moment(entry.date).toISOString(), 
  eventType : "Note", 
  secret: hash_secret, 
  enteredBy: 'apple' }));

console.log('heart rates:',heartRate);
console.log('----------------------------------');

// now let's read mydata.json and the second object in the array (steps)
//======================================================================
const steps_x = mydata.data.metrics[1].data;

const steps = steps_x.map(entry => ({
  qty: Math.round(entry.qty), 
  time: Date.parse(entry.date).valueOf(), 
  dateString : moment(entry.date).toISOString() }));

console.log('steps:',steps);
console.log('----------------------------------');

// let's extract only the latest events from the arrays
//=====================================================
const HR_0 = heartRate[heartRate.length - 1];
const steps_0 = steps[steps.length -1];
console.log('HR_0:',HR_0);
console.log('steps_0:',steps_0);


// now let's upload the latest HR value
//====================================
fetch(api_url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(HR_0),
});

// now let's upload the latest HR value since last sync, with backfill
//===================================================================
//fetch(api_url, {
//   method: 'POST',
//  headers: {
//      'Content-Type': 'application/json',
//  },
//  body: JSON.stringify(heartRate),
//});
