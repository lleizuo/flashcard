// Browser
"use strict"

const APIrequest = require('request');
const http = require('http');

const APIkey = "AIzaSyB7HQtScB7iV0sQBeJd0yJAKlbi_1F7wRI";
const apiurl = "https://translation.googleapis.com/language/translate/v2?key="+APIkey

const express = require('express')
const port = 59353

const passport = require('passport');
const cookieSession = require('cookie-session');

const GoogleStrategy = require('passport-google-oauth20');

const googleLoginData = {
    clientID: '144960018877-6v74ckd48030657bb1lg30b6g0io3pra.apps.googleusercontent.com',
    clientSecret: 'CUwENqevo9xBVKBKXnWh1Syy',
    callbackURL: '/auth/accepted'
};

// Strategy configuration.
// Tell passport we will be using login with Google, and
// give it our data for registering us with Google.
// The gotProfile callback is for the server's HTTPS request
// to Google for the user's profile information.
// It will get used much later in the pipeline.
passport.use( new GoogleStrategy(googleLoginData, gotProfile) );

// Globals
const sqlite3 = require("sqlite3").verbose();  // use sqlite
const fs = require("fs"); // file system

const dbFileName = "Flashcards.db";
// makes the object that represents the database in our code
const db = new sqlite3.Database(dbFileName);  // object, not database.


const userdbFileName = "Users.db";
// makes the object that represents the database in our code
const userdb = new sqlite3.Database(userdbFileName);  // object, not database.


// Initialize table.
// If the table already exists, causes an error.
// Fix the error by removing or renaming Flashcards.db
const cmdStr = 'CREATE TABLE Flashcards (user INT, english TEXT, korean TEXT, seen INT, correct INT)'
db.run(cmdStr,tableCreationCallback);

const usercmdStr = 'CREATE TABLE Users (id INT, lastname varchar(255), firstname varchar(255), PRIMARY KEY (ID))'
userdb.run(usercmdStr,tableCreationCallback);

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
  userdumpDB();
    }
}

function tableUpdateCallback(err) {
    if (err) {
	console.log("Table update error",err);
    } else {
	console.log("Data updated.");
  dumpDB();
  userdumpDB();
    }
}

function dumpDB() {
    db.all ( 'SELECT * FROM Flashcards', dataCallback);
    function dataCallback( err, data ) {console.log(data)}
}

function userdumpDB() {
    userdb.all ( 'SELECT * FROM Users', dataCallback);
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
      let existed = false;
      let datalist = req.user.thedata;
      for (var i = 0; i < datalist.length; i++) {
        if(datalist[i].english == eng) {
          existed = true;
        }
      }
      if(!existed) {
        // database command
        const cmdInsertStr = 'INSERT into Flashcards (user, english, korean, seen, correct) VALUES (@0, @1, @2, 0, 0)';
        console.log("The command : " + cmdInsertStr );
        db.run(cmdInsertStr, req.session.passport.user, eng, kor, tableInsertionCallback);
      }
      res.json({});
    } else {
      next();
    }
}

function dataGetter(req, res, next) {
    res.json(req.user);
}

function usernameGetter(req, res, next) {
  userdb.all ( 'SELECT * FROM Users WHERE id = ' + req.session.passport.user, dataCallback);
  function dataCallback( err, data ) {
    res.json(data[0])
  }
}

function seenAdder(req, res, next) {
    let url = req.url;
    let qObj = req.query;
    console.log(qObj);
    if(qObj.id != undefined && qObj.english != undefined && qObj.new != undefined) {
        // database command
        const cmdUpdateStr = 'UPDATE Flashcards SET seen = ' + qObj.new + ' WHERE english = @0 AND user = ' + qObj.id;
        console.log("The command : " + cmdUpdateStr );
        db.run(cmdUpdateStr, qObj.english, tableUpdateCallback);
      res.json({});
    } else {
      next();
    }
}

function correctAdder(req, res, next) {
    let url = req.url;
    let qObj = req.query;
    console.log(qObj);
    if(qObj.id != undefined && qObj.english != undefined && qObj.new != undefined) {
        // database command
        const cmdUpdateStr = 'UPDATE Flashcards SET correct = ' + qObj.new + ' WHERE english = @0 AND user = ' + qObj.id;
        console.log("The command : " + cmdUpdateStr );
        db.run(cmdUpdateStr, qObj.english, tableUpdateCallback);
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

process.on('exit', function(){console.log("Exiting the terminal!");
  db.close();}); // Close database on exiting the terminal



// put together the server pipeline
const app = express()

// pipeline stage that just echos url, for debugging
app.use('/', printURL);
app.use(cookieSession({
    maxAge: 6 * 60 * 60 * 1000, // Six hours in milliseconds
    // meaningless random string used by encryption
    keys: ['hanger waldo mercy dance']
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/*',express.static('public'));
app.get('/auth/google',
	passport.authenticate('google',{ scope: ['profile'] }) );
app.get('/auth/accepted',
  	// for educational purposes
  	function (req, res, next) {
  	    console.log("at auth/accepted");
  	    next();
  	},
  	// This will issue Server's own HTTPS request to Google
  	// to access the user's profile information with the
  	// temporary key we got in the request.
  	passport.authenticate('google'),
  	// then it will run the "gotProfile" callback function,
  	// set up the cookie, call serialize, whose "done"
  	// will come back here to send back the response
  	// ...with a cookie in it for the Browser!
  	function (req, res) {
  	    console.log('Logged in and using cookies!')
  	    res.redirect('/user/lango.html');
});
app.get('/user/*',
    isAuthenticated, // only pass on to following function if
    	// user is logged in
    	// serving files that start with /user from here gets them from ./
    	express.static('.')
);
app.get('/store', storeHandler);   // if not, is it a valid translate?
app.get('/translate', translateHandler);   // if not, is it a valid translate?
app.get('/data', dataGetter);
app.get('/username', usernameGetter);
app.get('/seen', seenAdder);
app.get('/correct', correctAdder);
app.use( fileNotFound );            // otherwise not found

app.listen(port, function (){console.log('Listening...');} )

// new middleware functions

function printURL (req, res, next) {
    console.log(req.url);
    next();
}

function isAuthenticated(req, res, next) {
    if (req.user) {
	console.log("Req.session:",req.session);
	console.log("Req.user:",req.user);
	next();
    } else {
	res.redirect('/login.html');  // send response telling
	// Browser to go to login page
    }
}

function gotProfile(accessToken, refreshToken, profile, done) {
    console.log("Google profile",profile);
    // here is a good place to check if user is in DB,
    // and to store him in DB if not already there.
    // Second arg to "done" will be passed into serializeUser,
    // should be key to get user out of database.
    let id = profile.id;
    userdb.all ( 'SELECT * FROM Users WHERE id = ' + id, dataCallback);
    function dataCallback( err, data ) {
      if(data.length == 0) {
        let firstname = profile.name.givenName;
        let lastname = profile.name.familyName;
        const cmdInsertStr = 'INSERT into Users (id, lastname, firstname) VALUES (@0, @1, @2)';
        userdb.run(cmdInsertStr, id, lastname, firstname, tableInsertionCallback);
      }
    }

    let dbRowID = id;  // temporary! Should be the real unique
    // key for db Row for this user in DB table.
    // Note: cannot be zero, has to be something that evaluates to
    // True.

    done(null, dbRowID);
}

passport.serializeUser((dbRowID, done) => {
    console.log("SerializeUser. Input is",dbRowID);
    done(null, dbRowID);
});

passport.deserializeUser((dbRowID, done) => {
    console.log("deserializeUser. Input is:", dbRowID);
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object.
    let userData = {gid:0,thedata: "data from db row goes here"};

    db.all ( 'SELECT * FROM Flashcards WHERE user = ' + dbRowID, dataCallback);
    function dataCallback( err, data ) {
        console.log(err)
        userData.gid = dbRowID;
        userData.thedata = data;
        done(null, userData);
    }

});
