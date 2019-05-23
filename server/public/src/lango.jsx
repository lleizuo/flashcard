'use strict';

let last_time_english = undefined;

let last_time_korean = undefined;

// Landing Page

const welcome = <div className = "welcomeText"> Welcome to Lango! </div>
const customize = <div className = "customizeVocab"> Customize your vocabulary </div>
const landing_page_top = (
    <div id = "landingPageTop"> {welcome}{customize}</div>
);
const green = (<div className = "greenBar" onClick = {GoMainPage}>   <img id = "googleImg" src = {'./assets/google.jpg'}/> <div id = "logInText"> Log in with Google </div> </div>);
const landing_page_bottom = (
    <div id = "landingPageBottom"> {green} </div>
);

const landing_page = (<main>
                {landing_page_top}
                {landing_page_bottom}
        </main>);

// Main Page

function GoMainPage() {
			let x = document.getElementsByTagName("main")[0];
			x.style.flexDirection = "column";
			ReactDOM.render(
			    main_page,
			    document.getElementById('root')
			);
		}

// Elements to go into the DOM
const lango = <h1 id="logo">Lango!</h1>;

const start_review = <div className="purplebutton" onClick={GoAnswerPage}>Start Review</div>

const cannot_see = <div id="cannotsee" className="purplebutton">End Review</div>

const main_top_div = (
		<div id="maintopdiv">{start_review}{lango}{cannot_see}</div>
);

function MainEnglishCard() {
	 return (<div className="textCard">
	 <textarea id="mainLeft" placeholder="English" onKeyPress={MainLeftReturn} />
	 </div>);
	 }

function MainTranslationCard() {
         return (<div className="textCard">
				 			<p id="mainRight">Translation</p>
		  </div>);
            }

function MainLeftReturn(event) {
		if(event.charCode == 13) {
			document.getElementById("mainRight").textContent = "Goodbye world!";
			makeTranslateRequest();
		}
}

const main_cards_div = (
		<div id="maincardsdiv">
		<MainEnglishCard />
		<MainTranslationCard />
		</div>
);

const main_save_div = (
		<div id="mainsavediv">
				<div className="greenbutton" onClick={makeStoreRequest}>
						Save
				</div>
		</div>
);

const username = "UserName";

const bottom = (<div id="bottom">{username}</div>);

// An element with some contents, including a variable
// that has to be evaluated to get an element, and some
// functions that have to be run to get elements.
const main_page = (<main>
		{main_top_div}
		{main_cards_div}
		{main_save_div}
		{bottom}
	      </main>
	     );


// Answer page

function GoAnswerPage() {
			ReactDOM.render(
			    answer_page,
			    document.getElementById('root')
			);
			last_time_korean = undefined;
			last_time_english = undefined;
		}


const add = <div className="purplebutton" onClick={GoMainPage}> Add </div>

const answer_top_div = (
				<div id="answertopdiv">{add}{lango}{cannot_see}</div>
);

const refresh = <img id="refresh" src={'./assets/noun_Refresh_2310283.svg'}/>

const answer_cards_div = (
		<div id="answercardsdiv">
		<AnswerTargetCard />
		<AnswerGuessCard />
		</div>
);

function AnswerTargetCard() {
	 return (<div id="answer1" className="textCard">
	 			{refresh}
			 <p id="answertargetcard">Korean Word</p>
			 		</div>);
	 }

function AnswerGuessCard() {
	return (<div id="answer2" className="textCard">
	<textarea id="answerguesscard" placeholder="Try here!"/>
	</div>);
}


const answer_next_div = (
		<div id="answernextdiv">
				<div className="greenbutton">
						Next
				</div>
		</div>
);

const answer_page = (
		<main>
				{answer_top_div}
				{answer_cards_div}
				{answer_next_div}
				{bottom}
		</main>
);






// Default render : landing page

ReactDOM.render(
    landing_page,
    document.getElementById('root')
);

// onKeyPress function for the textarea element
// When the charCode is 13, the user has hit the return key
function checkReturn(event) {
	 console.log(event.charCode);
}







	 // Create the XHR object.
function createCORSRequest(method, url) {
	   let xhr = new XMLHttpRequest();
	   xhr.open(method, url, true);  // call its open method
	   return xhr;
}

// Make the actual CORS request.
function makeTranslateRequest() {

	   let url = "/translate?english=" + document.getElementById("mainLeft").value;

	   let xhr = createCORSRequest('GET', url);

	   // checking if browser does CORS
	   if (!xhr) {
	     alert('CORS not supported');
	     return;
	   }

	   // Load some functions into response handlers.
	   xhr.onload = function() {
	       let responseStr = xhr.responseText;  // get the JSON string
	       let object = JSON.parse(responseStr);  // turn it into an object
	       console.log(JSON.stringify(object, undefined, 2));  // print it out as a string, nicely formatted
				 last_time_english = document.getElementById("mainLeft").value.trim();
				 updateMainRight(object);
	   };

	   xhr.onerror = function() {
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

	if(last_time_english == undefined || last_time_korean == undefined) {
			alert("You did not even enter a word!");
			return;
	}

  if(last_time_english == "" || last_time_korean == "") {
    alert("Empty is not allowed!");
    return;
  }

	let url = "/store?english=" + last_time_english + "&korean=" + last_time_korean;

	let xhr = createCORSRequest('GET', url);

	// checking if browser does CORS
	if (!xhr) {
		alert('CORS not supported');
		return;
	}

	// Load some functions into response handlers.
	xhr.onload = function() {
			let responseStr = xhr.responseText;  // get the JSON string
			let object = JSON.parse(responseStr);  // turn it into an object
			console.log(JSON.stringify(object, undefined, 2));  // print it out as a string, nicely formatted
	};

	xhr.onerror = function() {
		alert('Woops, there was an error making the request.');
	};

	// Actually send request to server
	xhr.send();
}
