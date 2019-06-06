'use strict';

let last_time_english = undefined;

let last_time_korean = undefined;

let dataarray = undefined;

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

let username = "UserName";

let bottom = (<div id="bottom">{username}</div>);

// An element with some contents, including a variable
// that has to be evaluated to get an element, and some
// functions that have to be run to get elements.
let main_page = (<main>
		{main_top_div}
		{main_cards_div}
		{main_save_div}
		{bottom}
	      </main>
	     );


// Answer page

function GoAnswerPage() {
      if(dataarray.thedata.length > 0) {
        ReactDOM.render(
            answer_page,
            document.getElementById('root')
        );
        last_time_korean = undefined;
        last_time_english = undefined;
      } else {
        alert("Create some cards first before review!");
      }
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

let answer_page = (
		<main>
				{answer_top_div}
				{answer_cards_div}
				{answer_next_div}
				{bottom}
		</main>
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
	   let xhr = new XMLHttpRequest();
	   xhr.open(method, url, true);  // call its open method
	   return xhr;
}

function updateLocal() {

	   let url = "/data";

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
         dataarray = object;
	   };

	   xhr.onerror = function() {
	     alert('Woops, there was an error making the request.');
	   };

	   // Actually send request to server
	   xhr.send();
}

function makeUsernameRequest() {

	   let url = "/username";

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
				 username = object.firstname + " " + object.lastname;
         bottom = (<div id="bottom">{username}</div>);
         answer_page = (
             <main>
                 {answer_top_div}
                 {answer_cards_div}
                 {answer_next_div}
                 {bottom}
             </main>
         );
         main_page = (<main>
         		{main_top_div}
         		{main_cards_div}
         		{main_save_div}
         		{bottom}
         	      </main>
         );
         makeDataRequest();
	   };

	   xhr.onerror = function() {
	     alert('Woops, there was an error making the request.');
	   };

	   // Actually send request to server
	   xhr.send();
}

// Make the actual CORS request.
function makeDataRequest() {

	   let url = "/data";

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
         dataarray = object;
         if(object.thedata.length == 0) {
           ReactDOM.render(
               main_page,
               document.getElementById('root')
           );
         } else {
           ReactDOM.render(
               answer_page,
               document.getElementById('root')
           );
         }
	   };

	   xhr.onerror = function() {
	     alert('Woops, there was an error making the request.');
	   };

	   // Actually send request to server
	   xhr.send();
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
      updateLocal();
	};

	xhr.onerror = function() {
		alert('Woops, there was an error making the request.');
	};

	// Actually send request to server
	xhr.send();
}
