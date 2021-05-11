const dotenv = require('dotenv');
var result = require('dotenv').config();

var fs = require('fs');
const fetch = require('node-fetch');

const api_sgv1 = process.env.API_SGV1;

fetch(api_sgv1)
    .then(resSGV => resSGV.json())
    .then(json => {
        var jsonSGV = JSON.stringify(json, null, 4);
        fs.writeFile('./files/sgv1.json', jsonSGV, 'utf8', (err) => {
            if (err) throw err
            console.log('File created!')
        })
    });
