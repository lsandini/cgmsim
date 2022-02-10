#!/bin/bash

sudo apt update

sudo apt upgrade

sudo curl -sL https://deb.nodesource.com/setup_16.x -o nodesource_setup.sh

sudo bash nodesource_setup.sh

sudo apt install nodejs

sudo apt install npm

sudo npm install -g npm

sudo apt-get install -y libcurl4-openssl-dev

sudo apt-get install -y jq

npm install dotenv

npm i node-fetch@2.6.5

npm install mathjs

npm install moment

npm install perlin-noise

npm install json.date-extensions

npm install node-libcurl

npm add @babel/runtime

npm i form-data

npm audit fix
