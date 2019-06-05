'use strict';

// Landing Page

const welcome = <div className = "welcomeText"> Welcome to Lango! </div>
const customize = <div className = "customizeVocab"> Customize your vocabulary </div>
const landing_page_top = (
    <div id = "landingPageTop"> {welcome}{customize}</div>
);
const green = (<a href="../auth/google"> <div className = "greenBar" onClick = {GoLogin}><img id = "googleImg" src = {'./assets/google.jpg'}/> <div id = "logInText"> Log in with Google </div> </div>  </a>);
const landing_page_bottom = (
    <div id = "landingPageBottom"> {green} </div>
);

const landing_page = (<main>
                {landing_page_top}
                {landing_page_bottom}
        </main>);


// Default render : landing page

ReactDOM.render(
    landing_page,
    document.getElementById('root')
);

function GoLogin() {
	console.log("dang dang!")
}
