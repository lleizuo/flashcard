'use strict';

// Landing Page

var welcome = React.createElement(
    "div",
    { className: "welcomeText" },
    " Welcome to Lango! "
);
var customize = React.createElement(
    "div",
    { className: "customizeVocab" },
    " Customize your vocabulary "
);
var landing_page_top = React.createElement(
    "div",
    { id: "landingPageTop" },
    " ",
    welcome,
    customize
);
var green = React.createElement(
    "div",
    { className: "greenBar", onClick: GoLogin },
    "   ",
    React.createElement("img", { id: "googleImg", src: './assets/google.jpg' }),
    " ",
    React.createElement(
        "div",
        { id: "logInText" },
        " Log in with Google "
    ),
    " "
);
var landing_page_bottom = React.createElement(
    "div",
    { id: "landingPageBottom" },
    " ",
    green,
    " "
);

var landing_page = React.createElement(
    "main",
    null,
    landing_page_top,
    landing_page_bottom
);

// Default render : landing page

ReactDOM.render(landing_page, document.getElementById('root'));

function GoLogin() {
    console.log("dang dang!");
}