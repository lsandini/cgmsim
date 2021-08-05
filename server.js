var express = require('express');
var fs = require('fs');
// Create the app
var app = express();

// Set up the server
// process.env.PORT is related to deploying on heroku
var server = app.listen(process.env.PORT || 3000, listen);

// This call back just tells us that the server has started
function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://' + host + ':' + port);
}


// this is the API to accept JSON files
app.use(express.json());

app.post('/', function(request, response){
  console.log(request.body);      // your JSON
   response.send(request.body);

  var mydata = JSON.stringify(request.body, null, 2);

  var reply = fs.writeFile('mydata.json', mydata, finished);

function finished() {
console.log('all set')
};

   response.send(reply);

});
