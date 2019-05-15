// Browser
"use strict"

const APIrequest = require('request');
const http = require('http');

const APIkey = "AIzaSyB7HQtScB7iV0sQBeJd0yJAKlbi_1F7wRI";
const apiurl = "https://translation.googleapis.com/language/translate/v2?key="+APIkey


const express = require('express')
const port = 59353



fucntion translateHandler(req, res, next) {
    let url = req.url;
    let qObj = req.query;
    console.log(qObj);
    if(qObj.english != undefined) {
        issueAPIrequest(qObj.english);
    } else {
        next();
    }
}

function fileNotFound(req, res) {
    let url = req.url;
    res.type('text/plain');
    res.status(404);
    res.send('Cannot find '+url);
    }

// put together the server pipeline
const app = express()
app.use(express.static('public'));  // can I find a static file?
app.get('/translate', translateHandler );   // if not, is it a valid query?
app.use( fileNotFound );            // otherwise not found

app.listen(port, function (){console.log('Listening...');} )




// API

function issueAPIrequest(entext) {

  let requestObject =
      {
        "source": "en",
        "target": "ko",
        "q": [
          entext
        ]
      }
  console.log("English phrase: ", requestObject.q[0]);


  // The call that makes a request to the API
  // Uses the Node request module, which packs up and sends off
  // an HTTP message containing the request to the API server
  APIrequest(
  	{ // HTTP header stuff
  	    url: url,
  	    method: "POST",
  	    headers: {"content-type": "application/json"},
  	    // will turn the given object into JSON
  	    json: requestObject	},
  	// callback function for API request
  	APIcallback
      );
}

// callback function, called when data is received from API
function APIcallback(err, APIresHead, APIresBody) {
    // gets three objects as input
    if ((err) || (APIresHead.statusCode != 200)) {
        // API is not working
        console.log("Got API error");
        console.log(APIresBody);
    } else {
        if (APIresHead.error) {
            // API worked but is not giving you data
            console.log(APIresHead.error);
        } else {
            console.log("In Korean: ", APIresBody.data.translations[0].translatedText);
            console.log("\n\nJSON was:");
            console.log(JSON.stringify(APIresBody, undefined, 2));
            // print it out as a string, nicely formatted
        }
    }
} // end callback function
