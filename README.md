CGM trace generator, MDI only  or CSII (version 2.0)  
===================================================

This application is simulating in an extremely basic way the effects food and various insulin analogs on continuous glucose monitor (CGM) curve in type 1 diabetes (T1D). It uses Nightscout (NS) as an input and visualization method.

Since even accurate physiological simulators can at best provide only an approximation of what happens in a biological organism, the goal is not even to try to match reality, but to provide a tool helping to visualize the fluctuations of glucose sensor values in response to various insulin analogs and food. 

The simulation can be used as a learning and practicing tool, with a goal of keeping the CGM curve values as much of possible in certain range. The target range is 3.9 – 10 mmol/l or 70-180 mg/dl, and the target Time In Range (TIR) is 70%.

To understand the mechanics of such a simulation, just a few things must be considered.

a)	The liver releases glucose into the bloodstream by either releasing its stores (glycogenolysis) or synthesizing new glucose from amino acids (gluconeogenesis). This is called the endogenous glucose production (EGP), and various biological states can affect it (not only alcohol!).

b)	The ingestion of food and the digestion and absorption of carbohydrates will also increase the blood glucose. After a short delay, the CGM will reflect the increase of blood glucose.

c)	This tool does not (yet) model the effect of exercise.

d)	Mealtime insulins have a short duration of activity (DIA -around 3 hours), while basal insulins are meant to be injected once or twice a day, and hence have a much longer duration of activity. Both will lower blood glucose and thus sensor glucose values.


Modeling the activity of mealtime insulins
=========================================
This has been done has been done extensively for aspart, lispro (and glulisine), and the model provided here: (https://github.com/LoopKit/Loop/issues/388#issuecomment-317938473 ). This is the model I use to compute the activity of each mealtime insulin dose (called "bolus" from now on). I selected a peak time of 55 minutes and a DIA of 300 min. Please notice that these settings may vary, but they are used by the mathematical model and do not always reflect the perception of the duration of activity of a single dose. They can be easily modified in the code, should the user prefer a shorter time to peak, e.g. for faster aspart insulin Fiasp®.


Modeling the activities of the long-acting agonists
===================================================
For detemir and glargine instead, models are still lacking. Based on clamp studies in T1D, the intra-individual, day-to-day variation is an important factor affecting the predictability of a single repeated dose. Moreover, the inter-individual variability makes modeling a challenge. Even with the best curve-fitting tools, no “global model” was achieved.

Since the goal is not to make a perfect model, I decided to use a sinusoidal curve to model detemir, and a half-ellipse for glargine. The obvious reasons are that the mathematics are simple. 


Modeling Levemir (Levemir®)
============================
The clamp studies show that the dose-response curve is linear. With increasing doses from 0.1U/kg to 1.6U/kg, the total activity, or area under the curve (AUC) of the glucose infusion rate (GIR) needed to maintain normal blood glucose is a straight line.
 
![image](https://user-images.githubusercontent.com/18611419/109794079-26fe5f80-7c1e-11eb-916c-3944d259f2a3.png)
 
However, the DIA seems related to the dose/kg, so that had to be considered in the model. The AUC precisely reflects the injected number of units and is identical for 12U @0.1U/kg and 12U @0.4U/kg.
However, when increasing the do dose from 12U @0.4U/kg to 24U @0.4U/kg, you can see that the DIA increases:

![image](https://user-images.githubusercontent.com/18611419/109794111-3382b800-7c1e-11eb-92b6-b04351691c5f.png)


Duration of Levemir action = 16 + (20 * U/weight)
So for 0.1 U/kg, the duration of action is 16+(20 * 0.1) = 18 hours, and for 0.4U/kg, the DIA is 16+(20 * 0.4) = 24 hours.

And the model itself is:
y= units * (Math.PI/(duration * 2)) * (Math.sin(time * Math.PI/duration));


Modeling Glargine (Lantus®, Abasaglar®, Toujeo®)
================================================
For the time being, only glargine U100 is basically modeled here, with a DIA of 27 hours. Again, the AUC reflects the injected dose.

![image](https://user-images.githubusercontent.com/18611419/109794202-4c8b6900-7c1e-11eb-9c47-69054578e68f.png)

I “chopped” the equation in little bits fo clarity :

b = (2 * basalDose)/(Math.PI * duration);  // duration is 27 hours

x = (Date.now() - time0)/(60 * 60 * 1000); //time0 is the time of injection

g = x-(duration / 2);

gg = Math.pow(g,2);

h = duration / 2;

hh= Math.pow(h,2);

z = (x-gg) / hh;

bb = Math.pow(b,2);

y = 2 * Math.sqrt(bb * (1+z)); // where y is the activity of glargine over time


Here is a visual aid illustrating the differences between the activity curves of detemir and glargine at different doses:
 
![image](https://user-images.githubusercontent.com/18611419/109794249-5745fe00-7c1e-11eb-9d94-839c4a34d706.png)


Modeling the absorption of Carbs from the gut
=============================================

There are many complicated and more or less precise published models of carb absorption, but for the purpose of this simulation, a simple bilinear model like the one found in the book "Think Like a Pancreas" by Gary Scheiner, and used in Perceptus' Glycodyn simulator will do for now. https://github.com/Perceptus/GlucoDyn/blob/master/basic_math.pdf .

To make the absorption of carbs from meals more realistic, I divided each meal in fast and slow absorbing parts. The ratio of fast absorbing carbs is randomly computed to be 10-40 % of the whole meal. __However, since todays June 10th 2021, the first 40 g of each meal will always be fast absorbing, so all small snacks will be fast carbs !!!__. In the current version of the algorithm, the fast carbs will be abosrbed according to the bilinear model mentioned above, in a period of time of one hour. The remaining (slow) carbs are absorbed in a similar fashion, but over a period of 4 hours. 


Modeling the Endogenous Glucose Production (EGP) by the liver
=============================================================

While this is absolutely neither true nor realistic, for the time being the EGP is modeled as a linear function of time. It equivalents to 10g of absorbed carbs/hour, so depending on the user's insulin sensitivity factor (ISF, mmol/l/U) and carb ratio (CR, g/U), an the EGP effect is EGP * ISF * CR expressed in mmol/l/g. 

The EGP is significantly affected but the insulin activity, since in the repleted rested state, insulin decreases the liver glucose production more than it increases the peripheral glucose uptake. Moreover other factor like the ingestion of alcohol will significantly decrease the EGP, which could be simple modeled in the future.

__16.05.2021__ This feature is not yet in use, but a sinusoidal function is added, with which the liver blood glucose impact can be set to vary in a sinusoidal or cosinusoidal manner. The file __*sinus.js*__ creates the waveforms, and __*liver.js*__ computes and writes __*latest_liver.json*__, not in use yet. This can be added to __*sgv_start.js*__ later.

__17.05.2021__ Now sinusoidal variation of liver glucose production is in testing phase. If the ISF is 2mmol/l/U and the CR is 10g/U, then the Carb Factor (CF) is 2mmol/l/10g. Since 10g are produced per hour, the increase in BG due to the liver glucose production is 2mmol/l/h or 0.1666 mmol/l/5min. Multiplying this by a sinusoidal value oscillating from 0.8 to 1.2 will make this impact on BG vary from 0.1333 to 0.2000 mmol/l/5min. the sinus cycle starts at midnight, is maximal at 6 AM (mimicking a dawn effect), back to baseline at 12 AM, minimal at 6 PM (mimicking the effect of light physical activity), and back to baseline at midnight.

![595142-20200914215212221-2008104967](https://user-images.githubusercontent.com/18611419/118400717-71af4580-b66b-11eb-9356-abb859db304f.jpg)


Modeling exercise
=================
Exercise modeling is not part of the project yet.

Random effects
==============
Since random number generators produce very jumpy values with various distributions between defined limits, I preferred trying a smoother, more "organic" noise function curve. Using a one-dimensional perlin-noise generator, an array of 17 * 17 = 289 values __*(perlin.json)*__ is produced each night at midnight by __*perlin.js*__. Each value gets a timestamp in 5 minute increments. Read more about perlin noise here: https://github.com/andrewrk/node-perlin-noise#readme. 

Every five minutes, as the next SGV value is computed, the latest perlin noise value in the last 5 minutes is taken into account. For now, the best settings are amplitude 0.3, octaves 1 and persistance 0.3. The values are multiplied by 10, and then again by 18 to get mg/dl, then added to the SGV jst before upload.


Mechanics of the simulator
==========================
I run the software on a Ubuntu 20.04 virtual machine (a droplet on Digital Ocean, but any physical or virtual computer will do). So it is a realtime bot collecting insulin and food entries from Nightscout, and uploading sensor glucose values (SGV) data back to Nightscout. The CGMSIM user doesn't have to use any other software or hardware, only a working Nightscout website with the Careportal plugin installed.

Inputs for every category (virtual mealtime insulins, virtual meals) are declared using Careportal. Long acting or "basal" insulin agonists must be declared as "announcements", and in the text field the correct insulin product and dose are to be declared using the following format: "detemir 15" or "glargin 26" (without quotes).

The first bash script (__*get-all.sh*__) first calls the "*entries.json*", "*sgv.json*" and "*profile.json*" using the Nightscout API, every 5 minutes. From the entries, I identify the (mealtime) insulins and meals, as well as the "announcements", containing data about basal insulins (product and dose). 

The activities of the various insulins are computed separately. 

- First I call __*computeBolusIOB.js*__, which parses *entries.json* into an object with dates, then computes the activity of each bolus according to the time since injection. At the end it calculates the current aggregated activity of the boluses and this is written into the file __*last_mealtime.json*__.

- Next I call __*computeBasalIOB.js*__, which parses the entries into an object with dates again, but writes the detemir and glargine entries into 2 separate files: *__last_detemir.json__* and *__last_glargine.json__*.

The *__detemir.js__* and *__glargine.js__* scripts calculate the current aggregated activity of each basal insulin separately, and write them to *__last_detemir_aggrACT.json__* and *__last_glargine_aggrACT.json__*.

Finally the script *__all_insulin.js__* calls the json files storing the aggregated activities of the mealtime insulin boluses, the detemir and glargine doses, and computes the global current insulin activity (variable: globalInsulinAct), which is expressed in U/min. 

__20.03.2021__ : The sim is now coupled to __https://dmpkl1.herokuapp.com !__ A bash __*upload-cgmsim.sh*__ script calls __*sgv_start.js*__, which retrieves the latest sgv (if exists!), and applies the insulin math above to compute the BG impact of insulin. It adds the BG impact of the liver (+1 mmol/l/h) and upload the new value every 5 minutes. 

__27.03.2021__ : The perlin noise generator files are created, and noise values can be added (or not) to the end of the __*sgv_start.js*__ in order to simulate random smooth variation of SGV values.

__28.03.2021__ : New feature: the SGV trend arrows are now evaluated from the mean delta of SGV values during the 3 previous 5 min intervals, and are incoporated into the __*sgv_start.js*__ script. The thresholds need to be fixed.

__02.04.2021__ : meals in the last six hours are now cumulated, and their fast and slow absorbing parts are taken into account, even for small amounts. The script __*all_meals.js*__ detects carbs from all entries, and creates the __*last_meals.json*__ file. This file is picked up by __*carbs.js*__ which computes the total carb absorption rate (in g/min).

Limits to the SGV values have been placed at 40 mg/dl (2.2 mmol/l) and 400 mg/dl (22.2 mmol/l) in order to keep the SGV curves on the NS display when the simulator is left unattended for longer periods of time.

When all data about blood glucose (BG) increasing factors (carbs and EGP), as well as BG decreasing factors (mealtime and basal insulins) are computed, their additive effect will be reflected in the sensor glucose value (sgv) uploaded to NS every 5 minutes. No predition curves are computed or displayed.

Adding an insulin pump
======================

__11.04.2021__ : insulin pump treatment (or continuous subcutaneous insulin infusion (CSII) treatment) is now made possible. The bash script __*get-pump.sh*__ retrieves and writes the __*pump_treatments.json*__  and __*profile.json*__  from NS. It then calls __*pump.js*__, where both json files are filtered for data. The pump basal profiles are either the <ins>default profile</ins> created in NS on first launch, the <ins>Autosync'ed profile</ins> sent daily from openAPS. All other treatment modalities (microboluses, Temporary Basal Rates) are taken from the __*pump_treatments.json*__ file. 

The bash script is run every 5 minutes, and __*pump.js*__ looks for an ongoing Temporary Basal rate. If none is set, it then looks for the latest AutoSync'ed basal rate, and if non is set, it will use the Default Basal Rate. The current basal rate is turned into a 5 minute insulin amount, which is added to an array called __*basalAsBoluses.json*__. This array contains the 5-minute entries from the previous DIA hours. The activity of each 5 minutes basal entry is computed and added, creating the pumpBasalAct valiable, saved as __*pumpBasalAct.json*__.

This activity of basals as boluses is added to the other insulin activities in __*sgv_start.js*__, where the total insulin activity is computed, before being transformed into BGI.

NEW feature (random meals + autobolusing - TEST PHASE)
=====================
__18.04.2021__ At midnight, cron runs a random meal generator. This creates 4 meals saved as __*randomMeals.json*__, valid for the next 24 hours:

- breakfast 6AM - 9AM, carbs 30-60g
- lunch 11AM - 1PM, carbs 60-100g
- snack 2PM - 4PM, carbs 20-40g
- dinner 5PM - 8PM, carbs 60-100g

__26.04.2021__ Every 5 minutes __*random_meal_upload.js*__ checks the random meals' time against the clock. If the meal time falls in the previous 5 min period, the details about the meal are uploaded using XMLHttpRequest.

Bolusing before meals is now automated, __*autobolus.js*__ tries to match the MDT pump's Bolus Wizard.

- first, check the time of the random meals
- check the current ISF, CR and BG targets from profiles (Default and/or Autosync). ONLY ONE ISF/CR VALUE IS USED FOR NOW, *either* from default of autosync profile.
- The insulin dose is computed for the carb amount, and correction is applied as necessary, aiming for the __high end of the target range__ (for now).
- compute the bolus amount and deliver the bolus 5-10 min before the meal, as the Fiasp model for mealtime insulin is used.
- To DO : use more than one ISF / CR value at different tmies of day, according to profile.


Installation 
============

In order to use this simulator, you'll need an instance of Nightscout (NS). If you are not familiar with NS, go over to https://nightscout.github.io/nightscout/new_user/ and be sure to follow all the steps and perform this installation first. Make sure to write down the URL and the APISECRET (for example "MYAPISECRET1").

The simulator itself works in a Linux Ubuntu 20.04 LTS environment. You'll need a computer or a virtual machine running Ubuntu in order to complete the CGMSIM-2 installation. I do not recommend running the simulation as the __root__ user. Instead, create a regular user with sudo privileges, in my case "lorenzo". There are plenty of tutorials for that.

The next steps involve: 

- downloading all the files from this Github repository
- installating the dependencies necessary for running the simulator
- setting up the environment variables
- kickstarting the simulator
- scheduling the tasks

1) Downloading the simulator 


Log into your Ubuntu terminal, and then run this command :

git clone https://github.com/lsandini/cgmsim.git

That's it. A folder called cgmsim has been made for you and all the needed files are in there.

If you'd like to run more simulators on the same machine, just run:

git clone https://github.com/lsandini/cgmsim.git cgmsim2

... and a separate folder called "cgmsim2" is made, identical to "cgmsim" 
 

2) Installing dependencies 


In your linux terminal, type : __bash install_dependencies.sh__. You might see warnings during the installation and it might take a little while. Just wait for the process to complete.

3) Setting up your personal environment 


At the root of the installation folder, create a file called __.env__ , it will contain your own environment variables. Look at the [__.envSAMPLE__](.main/.envSAMPLE) file included as an example. The __API_KEY__ is the hashed (or "scrambled" version of your APISECRET, the one that you set up during the NS installation. 

To make a "hashed" APISECRET is to use an online Hash generator: https://passwordsgenerator.net/sha1-hash-generator, enter your NS APISECRET in clear (e.g. MYAPISECRET1), select lower case hash, and generate. Copy the string into your .env file, and modify all lines adding your specific URL details.

4) Kickstarting the simulation 


In your linux terminal, type : __node kickstart-simulation.js__. This will create the first 3 CGM values of 90 mg/dl or 5 mmol/l, that should get uploaded immediately to your NS website.

5) Scheduling tasks 


In Linux, a service called __*cron*__ will execute the commands that you have specified in your settings. I added a __crontab.txt__ sample file to make the task easier. For this, in your Linux terminal, type crontab -e (and select nano or vi as your favourite text editor). Look at the sample file, and copy the lines in your own crontab.

- the first line reinitialises the perlin noise generator every 6 hours. 
- the second line launches the downloading process of previous SGV data etc, every 5 minutes
- the third line launches the calculations and uploads the new computed sgv values to NS, every 5 minutes.

- 2 more lines are commented out, but allow to use the simulator as a CSII (insulin pump) simulator and link the simulator to openAPS, Loop, FreeAPS, AndroidAPS, etc...

It may take a few minutes until you get a second reading, after which a new value is generated and uploaded every 5 minutes.


Make sure to report any bugs, suggest improvements, and spread the project. There is a lot to be done and the code will look awful to most NodeJS programmers  :D
