#!/bin/bash

touch .env
rm .env

echo -e "\e[96mFirst let's gather details about the simulated subject.\e[0m "
echo 
read  -p "What is the weight in kg ? " -r

WEIGHT=$REPLY
echo
echo -e "\e[92mOk, the weight is \e[0m\e[1m\e[92m$WEIGHT kg\e[0m."
echo

echo -e "\e[96mThe absorption or carbs will be AT MOST 360 minutes (or 6 hours). You can specify a shorter duration here.\e[0m "
echo
read -p "What is the longest absorption time for slowly absorbing meals (in minutes) ?  " -r
CARBS_ABS_TIME=$REPLY
echo
echo -e "\e[92mOk, the maximal carb absorption time will be \e[0m\e[1m\e[92m$CARBS_ABS_TIME minutes.\e[0m "
echo

echo -e "\e[96mThe profile of the mealtime insulin must be specified next.\e[0m"
echo
read -p "What is the peak action time (e.g. 55 min for Fiasp, 75 min for Novorapid) ?  " -r
TP=$REPLY
echo
echo -e "\e[92mOk, the the insulin peak activity will be reached at \e[0m\e[1m\e[92m$TP min.\e[0m"

echo
read -p "What is the total duration of insulin action or DIA (e.g. 5 hours for Fiasp or Novorapid) ?  " -r
DIA=$REPLY
echo
echo -e "\e[92mOk, the DIA is set to \e[0m\e[1m\e[92m$DIA hours or 300 min.\e[0m"
echo

echo -e "\e[96mThe simulator needs a more details about the simulated subject.\e[0m"
echo
read -p "What is your typical ISF ? Only one value for the whole 24h duration. If necessary, use a dot (.) and not a comma (,) as a decimal separator): " -r
  if [[ $REPLY =~ [0-9] ]]; then
    ISF="$REPLY"
    echo -e "\e[92mOk, your ISF is set to \e[0m\e[1m\e[92m$ISF mmol/l/h. \e[0m"
  else
    ISF=2
    echo -e "\e[92mOk, your ISF will be set to \e[0m\e[1m\e[92m2 mmol/l/h \e[0m\e[92mfor now.\e[0m"
  fi

echo 
read -p "What is your typical CR (carb ratio, in g/U)? :   " -r
echo

  if [[ $REPLY =~ [0-40] ]]; then
    CR="$REPLY"
    echo -e "\e[92mOk, \e[0m\e[1m\e[92m$CR units will be set as your carb ratio (CR).\e[0m"
  else
    CR=10
    echo -e "\e[92mOk, your carb ratio (CR) will be set to \e[0m\e[1m\e[92m10 for now.\e[0m"
  fi
echo

echo -e "\e[96mNow let's set up the connection to your Nightscout website.\e[0m"
echo
read -p "What is your the MYNIGHTSCOUT part of your Nightscout site URL? (i.e. https://MYNIGHTSCOUT.herokuapp.com)?  " -r
NIGHTSCOUT_HOST=$REPLY
echo
echo -e "\e[92mYour URL is \e[0m\e[1m\e[92mhttps://$NIGHTSCOUT_HOST.herokuapp.com\e[0m"
echo

echo -e "\e[96mNow let's set up your NS API_SECRET.\e[0m"
echo
read -p "What is your Nightscout API_SECRET (i.e. myplaintextsecret; It should be at least 12 characters long)?   " -r
APISECRET=$REPLY
echo -e "\e[92m \e[0m\e[1m\e[92m$APISECRET \e[0m\e[92m it is !\e[0m"
echo

echo ISF=$ISF >> .env
echo CR=$CR >> .env
echo WEIGHT=$WEIGHT >> .env
echo TP=$TP >> .env
echo DIA=$DIA >> .env
echo CARBS_ABS_TIME=$CARBS_ABS_TIME >> .env
echo >> test.txt
echo APISECRET="$APISECRET" >> .env
echo >> test.txt
echo NIGHTSCOUT_URL="'https://$NIGHTSCOUT_HOST.herokuapp.com'" >> .env
echo >> test.txt
echo API_URL_TEST="'https://$NIGHTSCOUT_HOST.herokuapp.com/api/v1/treatments'" >> .env
echo >> test.txt
echo API_URL="'https://$NIGHTSCOUT_HOST.herokuapp.com/api/v1/treatments'" >> .env
echo >> test.txt
echo API_PROFILE="'https://$NIGHTSCOUT_HOST.herokuapp.com/api/v1/profile.json'" >> .env
echo >> test.txt
echo API_SGV="'https://$NIGHTSCOUT_HOST.herokuapp.com/api/v1/entries/sgv.json'" >> .env
echo >> test.txt
echo API_SGV1="'https://$NIGHTSCOUT_HOST.herokuapp.com/api/v1/entries/sgv.json'" >> .env
echo >> test.txt
echo API_SGV2="'https://$NIGHTSCOUT_HOST.herokuapp.com/api/v1/entries/'" >> .env

chmod +x ./install_env.sh

node perlin.js;
exit