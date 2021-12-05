var FormData = require("form-data");
const math = require('mathjs');
const { writeFile } = require("fs/promises");
var fetch = require("node-fetch");
var formdata = new FormData();
var myDate = new Date();
var dateString = myDate.toISOString();
console.log("date", myDate, "dateString", dateString);
formdata.append("date", dateString);

var requestOptions = {
  method: "POST",
  body: formdata,
  redirect: "follow",
};

async function fetchText() {
  let response = await fetch("https://astro6.herokuapp.com/", requestOptions);
  let myData = await response.json();
  const dataJSON = JSON.stringify(myData, null, 4);

  const dataArray = Object.entries(myData);
  dataArray.forEach(([key, value]) => {
    console.log(key); // 'one'
    console.log(value); // 1
  });
  const arrayJSON = JSON.stringify(dataArray, null, 4);

  
  await writeFile("./files/data-local.json", dataJSON);
  await writeFile("./files/data-array.json", arrayJSON);
  console.log(myData);





// Now that the data is logged, let's process it
//==============================================

let G = 6.67408 * 10e-11;

console.log('mass of earth:', myData.earth_mass,'*10e+24 kg');
console.log('mass of mars:', myData.mars_mass,'*10e+24 kg');
console.log('distance earth_mars:', myData.marsd,'km');
console.log('geocentric longitude of mars:', myData.marsg.lon,'km');

//Attraction force between planets is G * (mass1 * mass2)/dist^2 

let forceMercuryEarth = G * (( myData.earth_mass*10e+24 * myData.mercury_mass*10e+24 ) / Math.pow((myData.mercuryd*1000), 2) );
let forceVenusEarth = G * (( myData.earth_mass*10e+24 * myData.venus_mass*10e+24 ) / Math.pow((myData.venusd*1000), 2) );
let forceMarsEarth = G * (( myData.earth_mass*10e+24 * myData.mars_mass*10e+24 ) / Math.pow((myData.marsd*1000), 2) );
let forceJupiterEarth = G * (( myData.earth_mass*10e+24 * myData.jupiter_mass*10e+24 ) / Math.pow((myData.jupiterd*1000), 2) );
let forceSaturnEarth = G * (( myData.earth_mass*10e+24 * myData.saturn_mass*10e+24 ) / Math.pow((myData.saturnd*1000), 2) );
let forceNeptuneEarth = G * (( myData.earth_mass*10e+24 * myData.neptune_mass*10e+24 ) / Math.pow((myData.neptuned*1000), 2) );

console.log('Attraction force between Mercury and Earth:', forceMercuryEarth.toExponential(),'Newtons');
console.log('Attraction force between Venus and Earth:', forceVenusEarth.toExponential(),'Newtons');
console.log('Attraction force between Mars and Earth:', forceMarsEarth.toExponential(),'Newtons');
console.log('Attraction force between Jupiter and Earth:', forceJupiterEarth.toExponential(),'Newtons');
console.log('Attraction force between Saturn and Earth:', forceSaturnEarth.toExponential(),'Newtons');
console.log('Attraction force between Neptune and Earth:', forceNeptuneEarth.toExponential(),'Newtons');


// let's compute the resulting attraction force vectors of all planets on earth

let x = (forceMercuryEarth * Math.cos(myData.mercuryg.lon)) + 
(forceVenusEarth * Math.cos(myData.venusg.lon)) +
(forceMarsEarth * Math.cos(myData.marsg.lon)) +
(forceJupiterEarth * Math.cos(myData.jupiterg.lon)) +
(forceSaturnEarth * Math.cos(myData.saturng.lon)) +
(forceNeptuneEarth * Math.cos(myData.neptuneg.lon));

let y = (forceMercuryEarth * Math.sin(myData.mercuryg.lon)) + 
(forceVenusEarth * Math.sin(myData.venusg.lon)) +
(forceMarsEarth * Math.sin(myData.marsg.lon)) +
(forceJupiterEarth * Math.sin(myData.jupiterg.lon)) +
(forceSaturnEarth * Math.sin(myData.saturng.lon)) +
(forceNeptuneEarth * Math.sin(myData.neptuneg.lon));

console.log('x exponential:', x.toExponential(), 'y exponential:', y.toExponential(),'y/x:', (y/x));
console.log('x:', x, 'y:', y);

let globalVectorLong = Math.atan(y/x) * 180 / Math.PI;
let globalVectorForce = Math.sqrt(x**2 + y**2).toExponential();

console.log('global vector force:', globalVectorForce, 'Newtons');
console.log('global vector longitude:', globalVectorLong, 'degrees');


//Attraction force between planet and patient (80kg) is G * (mass1 * mass2)/dist^2 

let forceMercuryEarth_p = G * (( 80 * myData.mercury_mass*10e+24 ) / Math.pow((myData.mercuryd*1000), 2) );
let forceVenusEarth_p = G * (( 80 * myData.venus_mass*10e+24 ) / Math.pow((myData.venusd*1000), 2) );
let forceMarsEarth_p = G * (( 80 * myData.mars_mass*10e+24 ) / Math.pow((myData.marsd*1000), 2) );
let forceJupiterEarth_p = G * (( 80 * myData.jupiter_mass*10e+24 ) / Math.pow((myData.jupiterd*1000), 2) );
let forceSaturnEarth_p = G * (( 80 * myData.saturn_mass*10e+24 ) / Math.pow((myData.saturnd*1000), 2) );
let forceNeptuneEarth_p = G * (( 80 * myData.neptune_mass*10e+24 ) / Math.pow((myData.neptuned*1000), 2) );

console.log('Attraction force between Mercury and patient:', forceMercuryEarth_p.toExponential(),'Newtons');
console.log('Attraction force between Venus and patient:', forceVenusEarth_p.toExponential(),'Newtons');
console.log('Attraction force between Mars and patient:', forceMarsEarth_p.toExponential(),'Newtons');
console.log('Attraction force between Jupiter and patient:', forceJupiterEarth_p.toExponential(),'Newtons');
console.log('Attraction force between Saturn and patient:', forceSaturnEarth_p.toExponential(),'Newtons');
console.log('Attraction force between Neptune and patient:', forceNeptuneEarth_p.toExponential(),'Newtons');

let x_p = (forceMercuryEarth_p * Math.cos(myData.mercuryg.lon)) + 
(forceVenusEarth_p * Math.cos(myData.venusg.lon)) +
(forceMarsEarth_p * Math.cos(myData.marsg.lon)) +
(forceJupiterEarth_p * Math.cos(myData.jupiterg.lon)) +
(forceSaturnEarth_p * Math.cos(myData.saturng.lon)) +
(forceNeptuneEarth_p * Math.cos(myData.neptuneg.lon));

let y_p = (forceMercuryEarth_p * Math.sin(myData.mercuryg.lon)) + 
(forceVenusEarth_p * Math.sin(myData.venusg.lon)) +
(forceMarsEarth_p * Math.sin(myData.marsg.lon)) +
(forceJupiterEarth_p * Math.sin(myData.jupiterg.lon)) +
(forceSaturnEarth_p * Math.sin(myData.saturng.lon)) +
(forceNeptuneEarth_p * Math.sin(myData.neptuneg.lon));

console.log('x_p exponential:', x_p.toExponential(), 'y_p exponential:', y_p.toExponential());

let globalVectorLong_p = Math.atan(y_p/x_p) * 180 / Math.PI;
let globalVectorForce_p = Math.sqrt((x_p**2) + (y_p**2));
let globalVectorLong_p_SD = math.std(myData.mercuryg.lon,myData.venusg.lon,myData.marsg.lon, myData.jupiterg.lon,myData.saturng.lon,myData.neptuneg.lon);

console.log('global vector longitude_p:', globalVectorLong_p, 'degrees');
console.log('global vector force_p:', globalVectorForce_p, 'Newtons');
console.log('global vector longitude_p SD:', globalVectorLong_p_SD, 'degrees');

let moon_IF = myData.moon_IF;

const forceVectors = JSON.stringify({
    tractionEarth: globalVectorForce, 
    vectorDirection_E:globalVectorLong, 
    tractionSubject:globalVectorForce_p, 
    vector_direction_S:globalVectorLong_p, 
    moon_illumination_fraction: moon_IF}, null, 4);

console.log(forceVectors);
await writeFile("./files/forceVectors.json", forceVectors);

}
fetchText();