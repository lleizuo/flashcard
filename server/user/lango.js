'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
		if (dataarray.thedata.length > 0) {
				answer_cards_div = React.createElement(
						"div",
						{ id: "answercardsdiv" },
						React.createElement(AnswerTargetCard, null),
						React.createElement(AnswerGuessCard, null)
				);
				answer_page = React.createElement(
						"main",
						null,
						answer_top_div,
						answer_cards_div,
						answer_next_div,
						bottom
				);

				ReactDOM.render(answer_page, document.getElementById('root'));
				last_time_korean = undefined;
				last_time_english = undefined;
				flag = 1;
		} else {
				alert("Create some cards first before review!");
		}
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

// React component for the front side of the card

var CardFront = function (_React$Component) {
		_inherits(CardFront, _React$Component);

		function CardFront() {
				_classCallCheck(this, CardFront);

				return _possibleConstructorReturn(this, (CardFront.__proto__ || Object.getPrototypeOf(CardFront)).apply(this, arguments));
		}

		_createClass(CardFront, [{
				key: "render",
				value: function render(props) {
						return React.createElement(
								"div",
								{ className: "card-side side-front" },
								React.createElement(
										"div",
										{ className: "card-side-container" },
										React.createElement(
												"h2",
												{ id: "trans" },
												this.props.text
										)
								)
						);
				}
		}]);

		return CardFront;
}(React.Component);

// React component for the back side of the card


var CardBack = function (_React$Component2) {
		_inherits(CardBack, _React$Component2);

		function CardBack() {
				_classCallCheck(this, CardBack);

				return _possibleConstructorReturn(this, (CardBack.__proto__ || Object.getPrototypeOf(CardBack)).apply(this, arguments));
		}

		_createClass(CardBack, [{
				key: "render",
				value: function render(props) {
						return React.createElement(
								"div",
								{ className: "card-side side-back" },
								React.createElement(
										"div",
										{ className: "card-side-container" },
										React.createElement(
												"h2",
												{ id: "congrats" },
												this.props.text
										)
								)
						);
				}
		}]);

		return CardBack;
}(React.Component);

function getCard() {
		var score_list = [];
		for (var i = 0; i < dataarray.thedata.length; i++) {
				var j = dataarray.thedata[i];
				if (j.seen == 0) {
						score_list[i] = Math.max(1, 5 - j.correct) + Math.max(1, 5 - j.seen);
				} else {
						score_list[i] = Math.max(1, 5 - j.correct) + Math.max(1, 5 - j.seen) + 5 * ((j.seen - j.correct) / j.seen);
				}
		}
		var random_card = Math.floor(Math.random() * dataarray.thedata.length);
		var random_number = Math.floor(Math.random() * 16);
		if (random_number <= score_list[random_card]) {
				return random_card;
		} else {
				var new_number = getCard();
				return new_number;
		}
}

function AnswerTargetCard() {
		var the_index = getCard();

		var front_text = dataarray.thedata[the_index].korean;
		var back_text = dataarray.thedata[the_index].english;
		return React.createElement(
				"div",
				{ id: "answer1", className: "textCard", onClick: clickHandler },
				refresh,
				React.createElement(
						"div",
						{ className: "card-body" },
						React.createElement(CardBack, { text: back_text }),
						React.createElement(CardFront, { text: front_text })
				)
		);
}

var flag = 1;

function MyFlip() {
		if (flag == 1) {
				document.getElementsByClassName("card-body")[0].style.transform = "rotateY(180deg)";
				//document.getElementById("answer1").style.transform = "rotateY(180deg)";
				flag = 2;
		} else {
				//document.getElementById("answer1").style.transform = "rotateY(0deg)";
				document.getElementsByClassName("card-body")[0].style.transform = "rotateY(0deg)";
				flag = 1;
		}
}

function AnswerGuessCard() {
		return React.createElement(
				"div",
				{ id: "answer2", className: "textCard" },
				React.createElement("textarea", { id: "answerguesscard", placeholder: "Try here!", onKeyPress: AnswerBotReturn })
		);
}

function AnswerBotReturn(event) {
		if (event.charCode == 13) {
				clickHandler();
		}
}

function clickHandler() {
		if (document.getElementById("answerguesscard").textContent == document.getElementById("congrats").value) {
				// Correct answer
		} else {
						// Wrong answer
				}
		MyFlip();
}

var answer_next_div = React.createElement(
		"div",
		{ id: "answernextdiv" },
		React.createElement(
				"div",
				{ className: "greenbutton", onClick: GoAnswerPage },
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
makeUsernameRequest();

// Create the XHR object.
function createCORSRequest(method, url) {
		var xhr = new XMLHttpRequest();
		xhr.open(method, url, true); // call its open method
		return xhr;
}

function updateLocal() {

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
		};

		xhr.onerror = function () {
				alert('Woops, there was an error making the request.');
		};

		// Actually send request to server
		xhr.send();
}

function makeUsernameRequest() {

		var url = "/username";

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
				username = object.firstname + " " + object.lastname;
				bottom = React.createElement(
						"div",
						{ id: "bottom" },
						username
				);
				answer_page = React.createElement(
						"main",
						null,
						answer_top_div,
						answer_cards_div,
						answer_next_div,
						bottom
				);
				main_page = React.createElement(
						"main",
						null,
						main_top_div,
						main_cards_div,
						main_save_div,
						bottom
				);
				makeDataRequest();
		};

		xhr.onerror = function () {
				alert('Woops, there was an error making the request.');
		};

		// Actually send request to server
		xhr.send();
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
				updateLocal();
		};

		xhr.onerror = function () {
				alert('Woops, there was an error making the request.');
		};

		// Actually send request to server
		xhr.send();
}