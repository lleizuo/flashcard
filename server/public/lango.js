'use strict';

// Landing Page

var landing_page = React.createElement(
	'main',
	null,
	React.createElement(
		'p',
		{ onClick: GoMainPage },
		'Click!'
	)
);

// Main Page

function GoMainPage() {
	ReactDOM.render(main_page, document.getElementById('root'));
}

// Elements to go into the DOM
var lango = React.createElement(
	'h1',
	{ id: 'logo' },
	'Lango!'
);

var start_review = React.createElement(
	'div',
	{ className: 'purplebutton' },
	'Start Review'
);

var cannot_see = React.createElement(
	'div',
	{ id: 'cannotsee', className: 'purplebutton' },
	'End Review'
);

var main_top_div = React.createElement(
	'div',
	{ id: 'maintopdiv' },
	start_review,
	lango,
	cannot_see
);

// A component - function that returns some elements
function MainEnglishCard() {
	return React.createElement(
		'div',
		{ className: 'textCard' },
		React.createElement('textarea', { id: 'mainLeft', placeholder: 'English', onKeyPress: MainLeftReturn })
	);
}

// Another component
function MainTranslationCard() {
	return React.createElement(
		'div',
		{ className: 'textCard' },
		React.createElement(
			'p',
			{ id: 'mainRight' },
			'Translation'
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
	'div',
	{ id: 'maincardsdiv' },
	React.createElement(MainEnglishCard, null),
	React.createElement(MainTranslationCard, null)
);

var main_save_div = React.createElement(
	'div',
	{ id: 'mainsavediv' },
	React.createElement(
		'div',
		{ className: 'greenbutton' },
		'Save'
	)
);

var username = "UserName";

var bottom = React.createElement(
	'div',
	{ id: 'bottom' },
	username
);

// An element with some contents, including a variable
// that has to be evaluated to get an element, and some
// functions that have to be run to get elements.
var main_page = React.createElement(
	'main',
	null,
	main_top_div,
	main_cards_div,
	main_save_div,
	bottom
);

// Default render : landing page

ReactDOM.render(landing_page, document.getElementById('root'));

// onKeyPress function for the textarea element
// When the charCode is 13, the user has hit the return key
function checkReturn(event) {
	console.log(event.charCode);
}

// Create the XHR object.
function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	xhr.open(method, url, true); // call its open method
	return xhr;
}

// Make the actual CORS request.
function makeTranslateRequest() {

	var url = "http://server162.site:59353/translate?english=" + document.getElementById("mainLeft").value;

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
}