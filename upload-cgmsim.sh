#!/bin/bash
curl -H "Accept: application/json" -H "Content-Type: application/json" https://dmpkl2.herokuapp.com/api/v1/entries/sgv/ | jq '.' > ./files/sgv1.json;

node sgv_start.js;

node upload-cgmsim.js;

