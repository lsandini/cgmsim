const sgvs = require('./files/sgv.json');
const direction = "Flat";

const sgvdir1 = sgvs[0].sgv - sgvs[1].sgv;
const sgvdir2 = sgvs[1].sgv - sgvs[2].sgv;
const sgvdir3 = sgvs[2].sgv - sgvs[3].sgv;
var sgvdir15min = (sgvdir1 + sgvdir2 + sgvdir3)/3;
console.log('this is the mean SGV 5 min variation in the last 15 minutes:',sgvdir15min,'mg/dl');

const arrows = [];

if (sgvdir15min < -10) {
    arrows.push ({sgvdir : sgvdir15min, direction : "DoubleDown"})

}  else if (sgvdir15min < -6) {
    arrows.push ({sgvdir : sgvdir15min, direction : "SingleDown"})

}  else if (sgvdir15min < -2) {
    arrows.push ({sgvdir : sgvdir15min, direction : "FortyFiveDown"})

}  else if (sgvdir15min < 2) {
    arrows.push ({sgvdir : sgvdir15min, direction : "Flat"})

}  else if (sgvdir15min < 6) {
    arrows.push ({sgvdir : sgvdir15min, direction : "FortyFiveUp"})

}  else if (sgvdir15min < 10) {
    arrows.push ({sgvdir : sgvdir15min, direction : "SingleUp"})

}  else if (sgvdir15min >= 10) {
    arrows.push ({sgvdir : sgvdir15min, direction : "DoubleUp"})
};
console.log(arrows);


const dataarrows = JSON.stringify(arrows, null, 4);
const fs = require('fs');
fs.writeFile('files/arrows.json', dataarrows, (err) => {
    if (err) {
        throw err;
    }
});
