var moment = require('moment');

const fetch = require('node-fetch');

var result = require('dotenv').config();
console.log('result', result);

const dotenv = require('dotenv');
//console.log(require('dotenv').config());

console.log('ISF*2:', process.env.ISF*2);
console.log('process.env.ISF:', process.env.ISF);

const time = Date.now();
console.log('time:',time);

const api_key = process.env.API_KEY;
const api_url = process.env.API_URL_TEST;

var lunchString = {
    time : time,
    dateString : moment(time).toISOString(),
    carbs : 13,
    enteredBy: 'randomMealGenerator',
    reason: 'lunch',
    secret: api_key
  };

const randomMeal = JSON.stringify(lunchString, null, 4);
console.log(randomMeal);


// THIS IS MY OLD WAY TO UPLOAD MEAL DATA
//=======================================
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xhrLU = new XMLHttpRequest();
// xhrLU.open("POST", api_url, true);
// xhrLU.setRequestHeader("Content-Type", "application/json");
// xhrLU.send(randomMeal);


// AND THIS IS THE NEW WAY !!!
//============================
fetch(api_url, {
    method: 'POST', 
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lunchString),
  });


