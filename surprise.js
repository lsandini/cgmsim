var food = require('./files/last_meals.json');
const dotenv = require('dotenv');
var result = require('dotenv').config();
var moment = require('moment');
const fetch = require('node-fetch');

const api_url = process.env.API_URL;

var jsonfood = JSON.stringify(food);
var karbs = JSON.parse(jsonfood);

//let's hash the APISECRET
const {
    createHash,
  } = require('crypto');
  const hash = createHash('sha1');
  hash.update(process.env.APISECRET);
  //console.log(hash.digest('hex'));
  const hash_secret = hash.digest('hex');
  console.log('this is the hashed secret:', hash_secret);


// let's read all the meals gathered by get-all.sh, and compute the total amount of carbs
// in the 1410 last minutes (23:30 min)
let totalMeals = karbs.map(entry => {
    var t = entry.time;
    var carbs_g = entry.carbs;

    if (t < 1410) {   

    return { ...entry, 
            time: t, 
            total_food: carbs_g,

         };
        } ;
 });
console.log(totalMeals);

var totalCarbs = totalMeals.reduce(function(tot, arr) { 
    return tot + arr.total_food;
  },0);

console.log(totalCarbs);


// now if the total amount of carbs is < 200g, let's create an announced meal
// completing the minimal daily allowance of 200g  :)

const date = Date.now();


if (totalCarbs < 200) {
var surprise = {
    time : Date.now(), 
    dateString : moment(date).toISOString(),
    carbs : (200 - totalCarbs).toString(),
    enteredBy: 'susprise_Meal_Generator',
    secret: hash_secret
    } 
};
console.log('surprise:', surprise);
console.log(api_url);


// now let's upload the meal (timer in crontab set to 21:30)
fetch(api_url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(surprise), 
});