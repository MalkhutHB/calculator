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

buttons.addEventListener("mousedown", (event) => {
    const button = event.target;
    const character = button.textContent;
    let operating = false;
    if (valid.includes(character)) {
        if (operation.includes(screen.textContent)) screen.textContent = "";
        else if (screen.textContent == "0") screen.textContent = ""; // this def wont work with decimals cuz you need leading 0          EDIT: SHOULLD WORK NOW!!!
        screen.textContent += button.textContent;
        screenNumber += button.textContent;
    }
    else if (operation.includes(character)) {
        if (!input1) input1 = Number(screen.textContent);
        else input1 = operate(input1, screen.textContent, operator);
        screen.textContent = character;
        screenNumber = "";
        operator = character;
    }
    else if (character == "=") {
        if (input1) screen.textContent = operate(input1, screen.textContent, operator);
        else screen.textContent = "";
        result = Number(screen.textContent);
        input1 = "";
    }
    else if (character == "AC") {
        screen.textContent = "";
        input1 = "";
    }
    else if (character == "ANS") {
        if (operation.includes(screen.textContent)) screen.textContent = "";
        else if (screen.textContent == "0") screen.textContent = "";
        screen.textContent += result;
    }
    else if (character == ".") {
        if (operation.includes(screen.textContent)) screen.textContent = "";
        let tempNumber = screen.textContent;
        tempNumber += "\u202A.\u202C";
        screen.textContent = tempNumber;
    }
    secondaryScreen.textContent = input1;
})


function operate(x, y, operator) {
    if (operator == "+") {
        return Number(x) + Number(y);
    }
    else if (operator == "-") {
        return Number(x) - Number(y);
    }
    else if (operator == "×") {
        return Number(x) * Number(y);
    }
    else if (operator == "÷") {
        return Number(x) * Number(y);
    }
}

// to do: 
// truncation of decimals
// make decimal work properly in rtl