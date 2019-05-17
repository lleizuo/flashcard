'use strict';

// Landing Page

const landing_page = (<main>
				<p onClick={GoMainPage}>Click!</p>



		</main>);

// Main Page

function GoMainPage() {
			ReactDOM.render(
			    main_page,
			    document.getElementById('root')
			);
		}

// An element to go into the DOM
const lango = <h1 id="logo">Lango!</h1>;

// A component - function that returns some elements
function MainEnglishCard() {
	 return (<div className="textCard">
	 <textarea id="mainLeft" onKeyPress={MainLeftReturn} />
	 </div>);
	 }

// Another component
function MainTranslationCard() {
         return (<div className="textCard">
				 			<p id="mainRight">Hello, world!</p>
		  </div>);
            }

function MainLeftReturn(event) {
		if(event.charCode == 13) {
			document.getElementById("mainRight").textContent = "Goodbye world!";
			makeTranslateRequest();
		}
}

// An element with some contents, including a variable
// that has to be evaluated to get an element, and some
// functions that have to be run to get elements.
const main_page = (<main>
		{lango}
	      	<MainEnglishCard />
	      	<MainTranslationCard />
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

	   let url = "http://server162.site:59353/translate?english=" + document.getElementById("mainLeft").value;

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
	       updateMainRight(object);
	   };

	   xhr.onerror = function() {
	     alert('Woops, there was an error making the request.');
	   };

	   // Actually send request to server
	   xhr.send();
}

function updateMainRight(object) {
	     document.getElementById("mainRight").textContent = object.data.translations[0].translatedText;
}
