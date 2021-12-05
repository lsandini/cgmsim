// START OF PLANETS SECTION
//==========================
const planets = require('./files/forceVectors.json');
 // the traction of planets is about 0.0015 (Newtons), add 1 !
let planetFactorA = 1 + planets.tractionSubject;
 // mkae the inverted dispertion a conjunction factor:
let conjunctionFactor = 1 + (planets.globalVectorLong_p_SDnorm1 / 10);

 // apply the correction due to inverted dispersion;
let planetFactor = planetFactorA * conjunctionFactor;

console.log('planet traction force:', planets.tractionSubject);
console.log('planetFactorA is 1 + traction force:', planetFactorA);
console.log('normalized inverted SD of longitude dispersion:', planets.globalVectorLong_p_SDnorm1);
console.log('conjunction factor:', conjunctionFactor);
console.log('planetFactorA * conjunction or planetFactor:', planetFactor);


 // the illumination fraction if the moon varies from 0 to 1, divide by 10 and add 1 !

let moonFactor = ((planets.moon_illumination_fraction)/10) +1 ;
console.log('moonFactor:', moonFactor);

// END OF PLANETS SECTION
//==========================