var time = Date.now();
console.log(time);

var perlin = require('perlin-noise');
var noise = perlin.generatePerlinNoise(288, 1, {
    amplitude: 0.3,
    octaveCount: 3,
    persistence: 0.3,
  });

console.log(noise);


const nuevo = noise.map((i) => Number(i));
console.log(nuevo);
var totalNoise = nuevo.reduce((a ,b) => a + b, 0);
var meanNoise = (totalNoise / nuevo.length) || 0;
console.log('this is the noise sum:',totalNoise);
console.log('this is the noise mean:',meanNoise);



const myObject = [];
var i = 0;
for (i=0; i<noise.length; i++) {
    myObject.push(
        {noise: noise[i]/10-0.05, order: (i), time : time + (i)*1000*60*5})
    }
console.log(myObject); 



const datamyObject = JSON.stringify(myObject, null, 4);
const fs = require('fs');
fs.writeFile('./files/perlin.json', datamyObject, (err) => {
    if (err) {
        throw err;
    }
});
