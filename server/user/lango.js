'use strict';

var last_time_english = undefined;

var last_time_korean = undefined;

var dataarray = undefined;

// Main Page

function GoMainPage() {
		var x = document.getElementsByTagName("main")[0];
		x.style.flexDirection = "column";
		ReactDOM.render(main_page, document.getElementById('root'));
}

// Elements to go into the DOM
var lango = React.createElement(
		"h1",
		{ id: "logo" },
		"Lango!"
);

var start_review = React.createElement(
		"div",
		{ className: "purplebutton", onClick: GoAnswerPage },
		"Start Review"
);

var cannot_see = React.createElement(
		"div",
		{ id: "cannotsee", className: "purplebutton" },
		"End Review"
);

var main_top_div = React.createElement(
		"div",
		{ id: "maintopdiv" },
		start_review,
		lango,
		cannot_see
);

function MainEnglishCard() {
		return React.createElement(
				"div",
				{ className: "textCard" },
				React.createElement("textarea", { id: "mainLeft", placeholder: "English", onKeyPress: MainLeftReturn })
		);
}

function MainTranslationCard() {
		return React.createElement(
				"div",
				{ className: "textCard" },
				React.createElement(
						"p",
						{ id: "mainRight" },
						"Translation"
				)
		);
}

function MainLeftReturn(event) {
		if (event.charCode == 13) {
				document.getElementById("mainRight").textContent = "Goodbye world!";
				makeTranslateRequest();
		}
}

var main_cards_div = React.createElement(
		"div",
		{ id: "maincardsdiv" },
		React.createElement(MainEnglishCard, null),
		React.createElement(MainTranslationCard, null)
);

var main_save_div = React.createElement(
		"div",
		{ id: "mainsavediv" },
		React.createElement(
				"div",
				{ className: "greenbutton", onClick: makeStoreRequest },
				"Save"
		)
);

var username = "UserName";

var bottom = React.createElement(
		"div",
		{ id: "bottom" },
		username
);

// An element with some contents, including a variable
// that has to be evaluated to get an element, and some
// functions that have to be run to get elements.
var main_page = React.createElement(
		"main",
		null,
		main_top_div,
		main_cards_div,
		main_save_div,
		bottom
);

// Answer page

function GoAnswerPage() {
		ReactDOM.render(answer_page, document.getElementById('root'));
		last_time_korean = undefined;
		last_time_english = undefined;
}

var add = React.createElement(
		"div",
		{ className: "purplebutton", onClick: GoMainPage },
		" Add "
);

var answer_top_div = React.createElement(
		"div",
		{ id: "answertopdiv" },
		add,
		lango,
		cannot_see
);

var refresh = React.createElement("img", { id: "refresh", src: './assets/noun_Refresh_2310283.svg' });

var answer_cards_div = React.createElement(
		"div",
		{ id: "answercardsdiv" },
		React.createElement(AnswerTargetCard, null),
		React.createElement(AnswerGuessCard, null)
);

function AnswerTargetCard() {
		return React.createElement(
				"div",
				{ id: "answer1", className: "textCard" },
				refresh,
				React.createElement(
						"p",
						{ id: "answertargetcard" },
						"Korean Word"
				)
		);
}

function AnswerGuessCard() {
		return React.createElement(
				"div",
				{ id: "answer2", className: "textCard" },
				React.createElement("textarea", { id: "answerguesscard", placeholder: "Try here!" })
		);
}

var answer_next_div = React.createElement(
		"div",
		{ id: "answernextdiv" },
		React.createElement(
				"div",
				{ className: "greenbutton" },
				"Next"
		)
);

var answer_page = React.createElement(
		"main",
		null,
		answer_top_div,
		answer_cards_div,
		answer_next_div,
		bottom
);

// onKeyPress function for the textarea element
// When the charCode is 13, the user has hit the return key
function checkReturn(event) {
		console.log(event.charCode);
}

// Beginning
makeDataRequest();

// Create the XHR object.
function createCORSRequest(method, url) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url, true); // call its open method
		return xhr;
}

// Make the actual CORS request.
function makeDataRequest() {

		var url = "/data";

		var xhr = createCORSRequest('GET', url);

		// checking if browser does CORS
		if (!xhr) {
				alert('CORS not supported');
				return;
		}

		// Load some functions into response handlers.
		xhr.onload = function () {
				var responseStr = xhr.responseText; // get the JSON string
				var object = JSON.parse(responseStr); // turn it into an object
				console.log(JSON.stringify(object, undefined, 2)); // print it out as a string, nicely formatted
				dataarray = object;
				if (object.thedata.length == 0) {
						ReactDOM.render(main_page, document.getElementById('root'));
				} else {
						ReactDOM.render(answer_page, document.getElementById('root'));
				}
		};

		xhr.onerror = function () {
				alert('Woops, there was an error making the request.');
		};

		// Actually send request to server
		xhr.send();
}

// Make the actual CORS request.
function makeTranslateRequest() {

		var url = "/translate?english=" + document.getElementById("mainLeft").value;

		var xhr = createCORSRequest('GET', url);

		// checking if browser does CORS
		if (!xhr) {
				alert('CORS not supported');
				return;
		}

		// Load some functions into response handlers.
		xhr.onload = function () {
				var responseStr = xhr.responseText; // get the JSON string
				var object = JSON.parse(responseStr); // turn it into an object
				console.log(JSON.stringify(object, undefined, 2)); // print it out as a string, nicely formatted
				last_time_english = document.getElementById("mainLeft").value.trim();
				updateMainRight(object);
		};

		xhr.onerror = function () {
				alert('Woops, there was an error making the request.');
		};

		// Actually send request to server
		xhr.send();
}

function updateMainRight(object) {
		document.getElementById("mainRight").textContent = object.Korean;
		last_time_korean = object.Korean.trim();
}

// Make the actual CORS request.
function makeStoreRequest() {

		if (last_time_english == undefined || last_time_korean == undefined) {
				alert("You did not even enter a word!");
				return;
		}

		if (last_time_english == "" || last_time_korean == "") {
				alert("Empty is not allowed!");
				return;
		}

		var url = "/store?english=" + last_time_english + "&korean=" + last_time_korean;

		var xhr = createCORSRequest('GET', url);

		// checking if browser does CORS
		if (!xhr) {
				alert('CORS not supported');
				return;
		}

		// Load some functions into response handlers.
		xhr.onload = function () {
				var responseStr = xhr.responseText; // get the JSON string
				var object = JSON.parse(responseStr); // turn it into an object
				console.log(JSON.stringify(object, undefined, 2)); // print it out as a string, nicely formatted
		};

		xhr.onerror = function () {
				alert('Woops, there was an error making the request.');
		};

		// Actually send request to server
		xhr.send();
}