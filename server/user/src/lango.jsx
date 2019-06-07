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
        answer_cards_div = (
        		<div id="answercardsdiv">
        		<AnswerTargetCard />
        		<AnswerGuessCard />
        		</div>
        );
        answer_page = (
        		<main>
        				{answer_top_div}
        				{answer_cards_div}
        				{answer_next_div}
        				{bottom}
        		</main>
        );

        ReactDOM.render(
            answer_page,
            document.getElementById('root')
        );
        last_time_korean = undefined;
        last_time_english = undefined;
        flag = 1;
      } else {
        alert("Create some cards first before review!");
      }
}


const add = <div className="purplebutton" onClick={GoMainPage}> Add </div>

const answer_top_div = (
				<div id="answertopdiv">{add}{lango}{cannot_see}</div>
);

const refresh = <img id="refresh" src={'./assets/noun_Refresh_2310283.svg'}/>

let answer_cards_div = (
		<div id="answercardsdiv">
		<AnswerTargetCard />
		<AnswerGuessCard />
		</div>
);

// React component for the front side of the card
class CardFront extends React.Component {
  render(props) {
    return(
      <div className='card-side side-front'>
         <div className='card-side-container'>
              <h2 id='trans'>{this.props.text}</h2>
        </div>
      </div>
    )
  }
}

// React component for the back side of the card
class CardBack extends React.Component {
  render(props) {
    return(
      <div className='card-side side-back'>
         <div className='card-side-container'>
              <h2 id='congrats'>{this.props.text}</h2>
        </div>
      </div>
    )
  }
}

function getCard() {
  let score_list = []
  for (var i = 0; i < dataarray.thedata.length; i++) {
    let j = dataarray.thedata[i];
    if(j.seen == 0) {
      score_list[i] = Math.max(1, 5 - j.correct) + Math.max(1,5 - j.seen)
    } else {
      score_list[i] = Math.max(1, 5 - j.correct) + Math.max(1,5 - j.seen) + 5*((j.seen - j.correct) / j.seen);
    }
  }
  let random_card =  Math.floor(Math.random() * dataarray.thedata.length);
  let random_number = Math.floor(Math.random() * 16);
  if(random_number <= score_list[random_card]) {
    return random_card;
  } else {
    let new_number = getCard();
    return new_number;
  }
}

function AnswerTargetCard() {
    let the_index = getCard();

    seenHandler(dataarray.thedata[the_index].english,dataarray.thedata[the_index].seen + 1);

    let front_text = dataarray.thedata[the_index].korean;
    let back_text = dataarray.thedata[the_index].english;
	 return (<div id="answer1" className="textCard"  onClick={clickHandler}>
	 			{refresh}
        <div className='card-body'>
          <CardBack text={back_text} />

          <CardFront text={front_text} />

          </div>
			</div>);
}

let flag = 1

function MyFlip() {
  if(flag == 1) {
    document.getElementsByClassName("card-body")[0].style.transform = "rotateY(180deg)";
    //document.getElementById("answer1").style.transform = "rotateY(180deg)";
    flag = 2
  } else {
    //document.getElementById("answer1").style.transform = "rotateY(0deg)";
    document.getElementsByClassName("card-body")[0].style.transform = "rotateY(0deg)";
    flag = 1
  }

}

function AnswerGuessCard() {
	return (<div id="answer2" className="textCard">
	<textarea id="answerguesscard" placeholder="Try here!" onKeyPress={AnswerBotReturn}/>
	</div>);
}

function AnswerBotReturn(event) {
		if(event.charCode == 13) {
        clickHandler();
		}
}

function clickHandler() {
  if(document.getElementById("answerguesscard").textContent == document.getElementById("congrats").value) {
    // Correct answer
  } else {
    // Wrong answer
  }
  MyFlip()
}


const answer_next_div = (
		<div id="answernextdiv">
				<div className="greenbutton" onClick={GoAnswerPage}>
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

// Make the actual CORS request.
function seenHandler(english,new_seen) {

	   let url = "/seen?id=" + dataarray.gid + "&english=" + english + "&new="+new_seen;

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

// Make the actual CORS request.
function correctHandler(english,new_correct) {

	   let url = "/correct?id=" + dataarray.gid + "&english=" + english + "&new="+new_correct;

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
