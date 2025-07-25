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
            if (answer >= 0) screen.textContent = answer;
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

    secondaryScreen.textContent = input1;
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

// to do: 
// shadow at the right side on overflow? Same color as bg so it only shows on the number?
//
// negative numbers display incorrectly because rtl
//
// delete not working on negative result, ig cuz "-" is not valid and it checks only the first char

// fix too many decimals issue. Should just display an error if NaN or something           fixed