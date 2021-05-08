const fetch = require('node-fetch');
const dotenv = require('dotenv');
var result = require('dotenv').config();
require('json.date-extensions');
JSON.useDateParser();
const fs = require('fs');
var moment = require('moment');

const api_url = process.env.API_URL_TEST;
const api_key = process.env.API_KEY;

var today = new Date();
console.log(today);

var breakfast = {};
var lunch = {};
var snack = {};
var dinner = {};

console.log('now:', Date.now());

const randomMealzz = require('./files/randomMeals.json');
var json = JSON.stringify(randomMealzz);
var randomMeals = JSON.parseWithDate(json);
console.log(randomMeals);

const breakfastString = JSON.stringify(randomMeals[0], null, 4);
console.log(breakfastString);

const lunchString = JSON.stringify(randomMeals[1], null, 4);
console.log(lunchString);

const snackString = JSON.stringify(randomMeals[2], null, 4);
console.log(snackString);

const dinnerString = JSON.stringify(randomMeals[3], null, 4);
console.log(dinnerString);

// time to meal in ms
let brDiff = (Date.now() - randomMeals[0].time);
let luDiff = (Date.now() - randomMeals[1].time);
let snDiff = (Date.now() - randomMeals[2].time);
let diDiff = (Date.now() - randomMeals[3].time);

//time to meal in hours
let brDiffmin = (Date.now() - randomMeals[0].time) / (60 * 60 * 1000);
let luDiffmin = (Date.now() - randomMeals[1].time) / (60 * 60 * 1000);
let snDiffmin = (Date.now() - randomMeals[2].time) / (60 * 60 * 1000);
let diDiffmin = (Date.now() - randomMeals[3].time) / (60 * 60 * 1000);

console.log(brDiff, luDiff, snDiff, diDiff);
console.log('time to br:', brDiffmin, 'time to lu:', luDiffmin, 'time to sn:', snDiffmin, 'time to di:', diDiffmin);



if (((Date.now() - randomMeals[0].time) > 0) && ((Date.now() - randomMeals[0].time) < (5 * 60 * 1000))) {
    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(randomMeals[0]),
    });
};

if (((Date.now() - randomMeals[1].time) > 0) && ((Date.now() - randomMeals[1].time) < (5 * 60 * 1000))) {
    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(randomMeals[1]),
    });
};

if (((Date.now() - randomMeals[2].time) > 0) && ((Date.now() - randomMeals[2].time) < (5 * 60 * 1000))) {
    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(randomMeals[2]),
    });
};

if (((Date.now() - randomMeals[3].time) > 0) && ((Date.now() - randomMeals[3].time) < (5 * 60 * 1000))) {
    fetch(api_url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(randomMeals[3]),
    });
};

