const fs = require('fs');
var moment = require('moment'); 
const result = require('dotenv').config();

const api_url = process.env.API_URL;
const api_key = process.env.API_KEY;

// at midnight, compute the time of every of the 4 random meals
// breakfast after 06:00 AM, within 3 hours
// lunhch after 11:00 AM, within 2 hours
// snack after 2 PM, within 2 hours
// dinner after 5 PM, within 3 hours

const time = Date.now();

let delayBr1 =  (6 + Math.random() * 3)*3600000;
let delayLu1 = (11 + Math.random() * 2)*3600000;
let delaySn1 = (14 + Math.random() * 2)*3600000;
let delayDi1 = (17 + Math.random() * 3)*3600000;

var breakfastTime = Math.floor(time + delayBr1);
var lunchTime     = Math.floor(time + delayLu1);
var snackTime     = Math.floor(time + delaySn1);
var dinnerTime    = Math.floor(time + delayDi1);

console.log('time now and time of meals:', time, breakfastTime, lunchTime, snackTime, dinnerTime);


// compute a random amount of carbs for each meal
// breakfast 30-60g
// lunch 60-100g
// snack 20-40g
// dinner 60-100g

var breakfastCarbs = 30 + Math.floor(Math.random()*30);
var lunchCarbs = 60 + Math.floor(Math.random()*40);
var snackCarbs = 20 + Math.floor(Math.random()*20);
var dinnerCarbs = 60 + Math.floor(Math.random()*40);
//console.log(breakfastCarbs, lunchCarbs, snackCarbs, dinnerCarbs);

const randomMealsArr = [{
  time : breakfastTime, 
  dateString : moment(breakfastTime).toISOString(),
  carbs : breakfastCarbs, 
  enteredBy: 'randomMealGenerator', 
  reason: 'breakfast',
  secret: api_key
  }, 
  {
    time : lunchTime, 
    dateString : moment(lunchTime).toISOString(),
    carbs : lunchCarbs, 
    enteredBy: 'randomMealGenerator', 
    reason: 'lunch',
    secret: api_key
  }, 
  {
    time : snackTime,
    dateString : moment(snackTime).toISOString(),
    carbs : snackCarbs, 
    enteredBy: 'randomMealGenerator', 
    reason: 'snack',
    secret: api_key
  }, 
  {
    time : dinnerTime, 
    dateString : moment(dinnerTime).toISOString(), 
    carbs : dinnerCarbs, 
    enteredBy: 'randomMealGenerator', 
    reason: 'dinner',
    secret: api_key
  }];

//console.log(randomMealsArr);

const randomMeals = JSON.stringify(randomMealsArr, null, 4);
fs.writeFile('./files/randomMeals.json', randomMeals, (err) => {
  if (err) {
      throw err;
  }
});
