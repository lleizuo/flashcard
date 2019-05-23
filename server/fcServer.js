// Browser
"use strict"

const APIrequest = require('request');
const http = require('http');

const APIkey = "AIzaSyB7HQtScB7iV0sQBeJd0yJAKlbi_1F7wRI";
const apiurl = "https://translation.googleapis.com/language/translate/v2?key="+APIkey


const express = require('express')
const port = 59353


// Globals
const sqlite3 = require("sqlite3").verbose();  // use sqlite
const fs = require("fs"); // file system

const dbFileName = "Flashcards.db";
// makes the object that represents the database in our code
const db = new sqlite3.Database(dbFileName);  // object, not database.

// Initialize table.
// If the table already exists, causes an error.
// Fix the error by removing or renaming Flashcards.db
const cmdStr = 'CREATE TABLE Flashcards (user INT, english TEXT, korean TEXT, seen INT, correct INT)'
db.run(cmdStr,tableCreationCallback);

// Always use the callback for database operations and print out any
// error messages you get.
// This database stuff is hard to debug, give yourself a fighting chance.
function tableCreationCallback(err) {
    if (err) {
	console.log("Table creation error",err);
    } else {
	console.log("Database created");
    }
}

function tableInsertionCallback(err) {
    if (err) {
	console.log("Table insertion error",err);
    } else {
	console.log("Data inserted.");
  dumpDB();
    }
}

function dumpDB() {
    db.all ( 'SELECT * FROM Flashcards', dataCallback);
    function dataCallback( err, data ) {console.log(data)}
}


function translateHandler(req, res, next) {
    let url = req.url;
    let qObj = req.query;
    console.log(qObj);
    if(qObj.english != undefined) {
        // API request
        let requestObject =
            {
              "source": "en",
              "target": "ko",
              "q": [
                qObj.english
              ]
            }
        console.log("English phrase: ", requestObject.q[0]);


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

                    // response
                    res.json({"English" : qObj.english, "Korean" : APIresBody.data.translations[0].translatedText});
                }
            }
        } // end callback function


        // The call that makes a request to the API
        // Uses the Node request module, which packs up and sends off
        // an HTTP message containing the request to the API server
        APIrequest(
        	{ // HTTP header stuff
        	    url: apiurl,
        	    method: "POST",
        	    headers: {"content-type": "application/json"},
        	    // will turn the given object into JSON
        	    json: requestObject	},
        	// callback function for API request
        	APIcallback
            );

    } else {
        next();
    }
}


function storeHandler(req, res, next) {
    let url = req.url;
    let qObj = req.query;
    console.log(qObj);
    if(qObj.english != undefined && qObj.korean != undefined) {
      let eng = qObj.english;
      let kor = qObj.korean;
      // database command
      const cmdInsertStr = 'INSERT into Flashcards (user, english, korean, seen, correct) VALUES (1, @0, @1, 0, 0)';
      db.run(cmdInsertStr, eng, kor, tableInsertionCallback);
      res.json({});
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

process.on('exit', function(){db.close();}); // Close database on exiting the terminal

// put together the server pipeline
const app = express()
app.use(express.static('public'));  // can I find a static file?
app.get('/store', storeHandler);   // if not, is it a valid translate?
app.get('/translate', translateHandler);   // if not, is it a valid translate?
app.use( fileNotFound );            // otherwise not found

app.listen(port, function (){console.log('Listening...');} )
