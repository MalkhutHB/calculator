const buttons = document.querySelector(".button-section");
const screen = document.querySelector(".screen");
const secondaryScreen = document.querySelector(".secondary-screen");
const valid = "0123456789.";
const operation = "+-÷×"

let input1;
let input2;
let result;
let operator;

buttons.addEventListener("mousedown", (event) => {
    const button = event.target;
    const character = button.textContent;
    let operating = false;
    if (valid.includes(character)) {
        if (operation.includes(screen.textContent)) screen.textContent = "";
        else if (screen.textContent == "0") screen.textContent = ""; // this def wont work with decimals cuz you need leading 0
        screen.textContent += button.textContent;
    }
    else if (operation.includes(character)) {
        if (!input1) input1 = Number(screen.textContent);
        else input1 = operate(input1, screen.textContent, operator);
        screen.textContent = character;
        operator = character;
    }
    else if (character == "=") {
        if (input1) screen.textContent = operate(input1, screen.textContent, operator);
        else screen.textContent = "";
        result = Number(Screen.textContent);
        input1 = "";
    }
    else if (character == "AC") {
        screen.textContent = "";
        input1 = "";
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
