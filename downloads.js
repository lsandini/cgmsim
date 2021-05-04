const fetch = require('node-fetch');
const result = require('dotenv').config();
const fs = require('fs');

const api_url = process.env.API_URL;
const api_profile = process.env.API_PROFILE;
const api_sgv = process.env.API_SGV;

var dir = './files';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

fetch(api_url)
    .then(resTreatments => resTreatments.json())
    .then(json => {
        var jsonTreatments = JSON.stringify(json, null, 4);
        fs.writeFile('./files/entries.json', jsonTreatments, 'utf8', (err) => {
            if (err) throw err
            console.log('File created!')
        })
    });

fetch(api_profile)
    .then(resProfile => resProfile.json())
    .then(json => {
        var jsonProfile = JSON.stringify(json, null, 4);
        fs.writeFile('./files/profile.json', jsonProfile, 'utf8', (err) => {
            if (err) throw err
            console.log('File created!')
        })
    });


fetch(api_sgv)
    .then(resSGV => resSGV.json())
    .then(json => {
        var jsonSGV = JSON.stringify(json, null, 4);
        fs.writeFile('./files/sgv.json', jsonSGV, 'utf8', (err) => {
            if (err) throw err
            console.log('File created!')
        })
    });


