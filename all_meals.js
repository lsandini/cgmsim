require('json.date-extensions');
JSON.useDateParser();

const fs = require('fs');

const entries = require('./files/entries.json');
var json = JSON.stringify(entries);
var date3 = JSON.parseWithDate(json);
//console.log(entries);

let meal = date3.filter(e => e.carbs).map(e => ({ time: e.created_at, carbs: e.carbs}));
console.log('this is the filtered meals (carbs):',meal);
console.log('length',meal.length) // returns the number of meals or lenghth of the array


var moment = require('moment'); 
const { i, typeOf, floor } = require('mathjs');
meals = meal.map(entry => ({ ...entry, time:moment(entry.time).valueOf()}));
timeSinceMealMin = meals.map(entry => ({ ...entry, mills: entry.time, time: (Date.now() - moment(entry.time).valueOf())/(1000*60)}));
console.log('this is the trimmed down meals and time since last meal:',timeSinceMealMin);

let lastMeals = timeSinceMealMin.filter(function (e) {
    return e.time <= 360; // keep only the meals from the last 6 hours or 360 min
});
console.log('these are the last meals: ',lastMeals);

const dataMeals = JSON.stringify(lastMeals, null, 4);

fs.writeFile('./files/last_meals.json', dataMeals, (err) => {
    if (err) {
        throw err;
    }
    console.log("JSON meals data is saved.");
});