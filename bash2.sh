#!/bin/bash

touch test.txt
rm test.txt

echo "First let's gather details about the simulated subject."
read -p "What is the weight in kg ? " -r
WEIGHT=$REPLY
echo

echo "The absorption or carbs will be AT MOST 360 minutes (or 6 hours). You can specify a shorter duration here."
read -p "What is the longest absorption time for slowly absorbing meals (in minutes) ? " -r
CARBS_ABS_TIME=$REPLY
echo

echo "The profile of the mealtime insulin must be specified here."
read -p "What is the peak action time (e.g. 55 min for Fiasp, 75 min for Novorapid ) ? " -r
TP=$REPLY
echo

read -p "What is the total duration of insulin  (e.g. 55 min for Fiasp, 75 min for Novorapid ) ? " -r
TP=$REPLY
echo

echo "Now let's set up the connection to your Nightscout website."
read -p "What is your the MYNIGHTSCOUT part of your Nightscout site URL? (i.e. https://MYNIGHTSCOUT.herokuapp.com)? " -r
NIGHTSCOUT_HOST=$REPLY
echo

echo "Now let's set up your NS API_SECRET."
read -p "What is your Nightscout API_SECRET (i.e. myplaintextsecret; It should be at least 12 characters long)? " -r
APISECRET=$REPLY
echo

echo "The simulator needs a few details about the simulated subject."
read -p "What is your typical ISF:   " -r
  if [[ $REPLY =~ [0-9] ]]; then
    ISF="$REPLY"
    echo "Ok, $ISF units will be set as your ISF."
  else
    ISF=2
    echo "Ok, your ISF will be set to 2 for now."
  fi

echo WEIGHT=$WEIGHT >> test.txt
echo CARBS_ABS_TIME=$CARBS_ABS_TIME

echo NIGHTSCOUT_HOST="$NIGHTSCOUT_HOST" >> test.txt

echo NIGHTSCOUT_URL="https://$NIGHTSCOUT_HOST.herokuapp.com" >> test.txt
echo APISECRET="$APISECRET" >> test.txt
echo ISF="$ISF" >> test.txt

chmod +x ./bash2.sh
exit