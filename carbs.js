var food = require('./files/last_meals.json');
var jsonfood = JSON.stringify(food);
var karbs = JSON.parse(jsonfood);
var carbrate = 0;
var COB = 0;

const carbAbsTime = parseInt(process.env.CARBS_ABS_TIME); // meal absoption time in min defautl 360 or 6 hours
const fast_carbAbsTime = carbAbsTime/6;  // = 1 h or 60 min
const slow_carbAbsTime = carbAbsTime/1.5;  // = 4 h or 240 min
const ISF = process.env.ISF; // insulin sensitivity factor in mmol/l/U, default 2
const CR = process.env.CR; // carb ratio in g/U, default 10


let timeSinceMealAct = karbs.map(entry => {
    var t = entry.time;
    var carbs_g = entry.carbs;
    var FSR = (Math.random() * (0.4 - 0.1) + 0.1);  // FSR = FAST RANDOM RATIO

    var fast_carbs = FSR * entry.carbs;
    var slow_carbs = (1-FSR) * entry.carbs;

        //console.log(fast_random_ratio);
        //console.log(fast_carbs);
        //console.log(slow_carbs);


        if (t < (fast_carbAbsTime/2)) {
            var AT2 = Math.pow(fast_carbAbsTime,2);
            var fast_carbrate = (fast_carbs * 4 * t)/AT2;
            var COB = (fast_carbs*2*Math.pow(t,2))/AT2;
        } 
        else if (t < (fast_carbAbsTime)) {
            var fast_carbrate = (fast_carbs * 4 / fast_carbAbsTime)*(1 -(t/fast_carbAbsTime));
            var AAA = (4*fast_carbs/fast_carbAbsTime);
            var BBB = Math.pow(t,2)/(2*fast_carbAbsTime);
            var COB = (AAA * (t-BBB)) - fast_carbs;
        } else {
            var fast_carbrate = 0;
            var COB = 0;
            console.log('fast carb absorption rate:', fast_carbrate);
        }

        if (t < (slow_carbAbsTime/2)) {
            var AT2 = Math.pow(slow_carbAbsTime,2);
            var slow_carbrate = (slow_carbs * 4 * t)/AT2;
            var COB = (slow_carbs*2*Math.pow(t,2))/AT2;
        } 
        else if (t < (slow_carbAbsTime)) {
            var slow_carbrate = (slow_carbs * 4 / slow_carbAbsTime)*(1 -(t/slow_carbAbsTime));
            var AAA = (4*slow_carbs/slow_carbAbsTime);
            var BBB = Math.pow(t,2)/(2*slow_carbAbsTime);
            var COB = (AAA * (t-BBB)) - slow_carbs;
        } else {
            var slow_carbrate = 0;
            var COB = 0;
            console.log('slow carb absorption rate:', slow_carbrate);
        }

    return { ...entry, 
            time: t, 
            fast_carbrate: fast_carbrate,
            slow_carbrate: slow_carbrate,
            all_carbrate: fast_carbrate + slow_carbrate
         };
 });
console.log(timeSinceMealAct);


var totalCarbRate = timeSinceMealAct.reduce(function(tot, arr) { 
    return tot + arr.all_carbrate;
  },0);

  console.log(totalCarbRate);

let carbrateString = JSON.stringify(totalCarbRate);
const fs = require('fs');
fs.writeFile("./files/latest_carbs.json", carbrateString, function(err, result) {
if(err) console.log('error', err);
});
