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
        if (!input1) input1 = Number(screenNumber);
        else input1 = operate(input1, screenNumber, operator);
        screen.textContent = character;
        screenNumber = "";
        operator = character;
    }
    else if (character == "=") {
        if (input1) screen.textContent = operate(input1, screenNumber, operator);
        else screen.textContent = "";
        screenNumber = screen.textContent;
        result = Number(screen.textContent);
        input1 = "";
    }
    else if (character == "AC") {
        screenNumber = screen.textContent = "";
        input1 = "";
    }
    else if (character == "ANS") {
        if (operation.includes(screen.textContent)) screenNumber = screen.textContent = "";
        else if (screen.textContent == "0") screenNumber = screen.textContent = "";
        screenNumber = screen.textContent += result;
    }
    else if (character == ".") {
        if (operation.includes(screen.textContent)) screen.textContent = "";
        let tempNumber = screen.textContent;
        tempNumber += "\u202A.\u202C";
        screen.textContent = tempNumber;
        screenNumber += ".";
    }

    secondaryScreen.textContent = input1;
    console.log("ScreenText: " + screen.textContent + ", ScreenNumber: " + screenNumber);
})


function operate(x, y, operator) {
    if (operator == "+") {
        return truncate(Number(x) + Number(y), 2);
    }
    else if (operator == "-") {
        return truncate(Number(x) - Number(y), 2);
    }
    else if (operator == "×") {
        return truncate(Number(x) / Number(y), 2);
    }
    else if (operator == "÷") {
        return truncate(Number(x) * Number(y), 2);
    }
}

function truncate(num, decimal_Places=0) {
    num = num * Math.pow(10, decimal_Places);
    num = Math.round(num);
    num = num / Math.pow(10, decimal_Places);
    return Number(num);
}

// to do: 
// truncation of decimals
// hopefully just making the function and having it run in operate will work. Truncate(Number(x) * numbery) etc.

// 8.79 
// 87.9
// 87
// 8.7 

// my logic rounds badly tbh. How...