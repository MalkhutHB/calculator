const buttons = document.querySelector(".button-section");
const screen = document.querySelector(".screen");
const secondaryScreen = document.querySelector(".secondary-screen");
const valid = "0123456789";
const operation = "+-÷×"

let input1;
let input2;
let result;
let operator;

let screenNumber = ""; // change the whole  program to use screenNumber instead of screen.textcontent 
let showingResult = false;

buttons.addEventListener("mousedown", (event) => {
    const button = event.target;
    const character = button.textContent;
    if (valid.includes(character)) {
        if (operation.includes(screen.textContent) && screen.textContent != "") screen.textContent = "";
        else if (screen.textContent == "0") screen.textContent = ""; 
        else if (showingResult) {screenNumber = screen.textContent = "";}
        screen.textContent += button.textContent;
        screenNumber += button.textContent;
        showingResult = false;
    }
    else if (operation.includes(character)) {
        if (!input1 && !Number.isNaN(input1)) input1 = Number(screenNumber);
        else if (!operation.includes(screen.textContent)) input1 = operate(input1, screenNumber, operator); // negatives!!
        screen.textContent = character;
        screenNumber = "";
        operator = character;
        showingResult = false;
    }
    else if (character == "=") {
        let answer;
        if (input1 || input1 == 0) {
            answer = operate(input1, screenNumber, operator);
            if (answer.toString().length > 7) screen.textContent = condense(answer); // can run a function on answer to sci note it
            else if (answer >= 0) screen.textContent = answer;
            else {
                screen.textContent = answer * -1;
                screen.textContent += "-";
            }
        }
        else if (Number.isNaN(input1)) screen.textContent = "error";
        else screen.textContent = "";
        screenNumber = answer;
        result = Number(screen.textContent);
        input1 = "";
        showingResult = true;
    }
    else if (character == "AC") {
        screenNumber = screen.textContent = "";
        input1 = "";
        showingResult = false;
    }
    else if (character == "ANS") {
        if (!result || !valid.includes(result.toString().charAt(0))) return;

        if (operation.includes(screen.textContent)) screenNumber = screen.textContent = "";
        else if (screen.textContent == "0") screenNumber = screen.textContent = "";
        screenNumber = screen.textContent += result;
        showingResult = false;
    }
    else if (character == ".") {
        if (operation.includes(screen.textContent)) screen.textContent = "";
        else if (showingResult) {screenNumber = screen.textContent = "";}
        let tempNumber = screen.textContent;
        tempNumber += "\u202A.\u202C";
        screen.textContent = tempNumber;
        screenNumber += ".";
        showingResult = false;
    }
    else if (character == "DEL") {
        if (!valid.includes(screen.textContent.charAt(0)) || screen.textContent.length == 0) return;
        else if (showingResult) { // basically just AC 
            screenNumber = screen.textContent = "";
            input1 = "";
            showingResult = false;
            return;
        }
        if (screenNumber.at(-1) == ".") screen.textContent = screen.textContent.slice(0, -3);
        else screen.textContent = screen.textContent.slice(0, -1);
        screenNumber = screenNumber.slice(0, -1);
        
    }

    if (input1 && input1.toString().length > 7) secondaryScreen.textContent = condense(input1);
    else secondaryScreen.textContent = input1;
    console.log("ScreenText: " + screen.textContent + ", ScreenNumber: " + screenNumber);
})

buttons.addEventListener("touchstart", (event) => {event.target.classList.add("pressed")});
buttons.addEventListener("touchend", (event) => {event.target.classList.remove("pressed")});
buttons.addEventListener("mousedown", (event) => {event.target.classList.add("pressed")});
buttons.addEventListener("mouseup", (event) => {event.target.classList.remove("pressed")});


function operate(x, y, operator) {
    if (operator == "+") {
        return truncate(Number(x) + Number(y), 2);
    }
    else if (operator == "-") {
        return truncate(Number(x) - Number(y), 2);
    }
    else if (operator == "×") {
        return truncate(Number(x) * Number(y), 2);
    }
    else if (operator == "÷") {
        if (y == 0) return "error"; 
        return truncate(Number(x) / Number(y), 2);
    }
}

function truncate(num, decimal_Places=0) {
    num = num * Math.pow(10, decimal_Places);
    num = Math.round(num);
    num = num / Math.pow(10, decimal_Places);
    return Number(num);
}

function condense(num) {
    const firstNum = num;
    let accuracy = 3;
    num = num.toExponential();
    let preNum = undefined;
    while (num.length > 8 && accuracy > 1 && !(exponentLength(num) > 2)) {
        preNum = num.toString();
        num = Number(num).toExponential(accuracy--); 
    }
    if (exponentLength(num) > 2) num = "overflow";

    if ((num == "overflow" && preNum) || Number(firstNum) == Number(preNum)) {
        let diff = preNum.length - 8;
        let decimalIndex = preNum.indexOf(".");
        //let negativeIndexOfE = preNum.indexOf("e")
        let deletionStart = preNum.length - (2 + exponentLength(preNum) + diff); // index -4 is right before e+00

        if (decimalIndex < 0 || decimalIndex > deletionStart) return num; 

        preNum = preNum.slice(0, deletionStart) + "" + preNum.slice(deletionStart + diff);
        if (preNum.length - preNum.indexOf("+") > 3) return num;
        return Number(preNum).toExponential(); // return as string because Number() would remove exponential form
    }
    return num;

    // want to overflow at e100 and only fit up to 3 decimals in the significand 
}

function exponentLength(num) {
    return -1 + (num.toString().length - num.toString().indexOf("+"));
}

// let num = 9.999e+99;
// console.log(condense(num));



// to do: 
// sci notation and/or overflow error for when result doesn't fit screen,    note: currently fits 7 numbers
//
// if you don't mouseup on the button (ie, click and drag, let go somewhere else) button stays pressed in
// 
// div 0 is giving "-NaN" instead of "error"



// pink ver: #c694cd