const buttons = document.querySelector(".button-section");
const screen = document.querySelector(".screen");
const secondaryScreen = document.querySelector(".secondary-screen");
const valid = "0123456789\u202A";
const operation = "+-÷×/*"

let input1;
let input2;
let result;
let operator;

let screenNumber = ""; 
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
        if (!input1 && !Number.isNaN(input1) && screenNumber) input1 = Number(screenNumber);
        else if (!input1 && !Number.isNaN(input1) && !screenNumber) input1 = result;
        else if (!operation.includes(screen.textContent)) input1 = operate(input1, screenNumber, operator); 
        screen.textContent = character;
        screenNumber = "";
        operator = character;
        showingResult = false;
    }
    else if (character == "=") {
        let answer;
        let shouldRespond = true;
        if (operation.includes(screen.textContent)) shouldRespond = false;
        else if (input1 || input1 === 0 || input1 === "0") {
            answer = operate(input1, screenNumber, operator);
            if (answer && answer.toString().length > 7) screen.textContent = condense(answer); 
            else if (answer >= 0 || answer == "error") screen.textContent = answer;
            else {
                screen.textContent = answer * -1;
                screen.textContent += "-";
            }
        }
        else if (Number.isNaN(input1)) screen.textContent = "error"; 
        else answer = screenNumber;

        if (shouldRespond) {
            screenNumber = answer;
            result = Number(screen.textContent);
            input1 = "";
            showingResult = true;
        }
        
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

        if (screenNumber.includes("."));
        else {
            let tempNumber = screen.textContent;
            tempNumber += "\u202A.\u202C";
            screen.textContent = tempNumber;
            screenNumber += ".";
            showingResult = false;
        }
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

buttons.addEventListener("touchstart", (event) => {
    event.target.classList.add("pressed")
    document.addEventListener("touchend", () => {event.target.classList.remove("pressed")});
});
buttons.addEventListener("mousedown", (event) => {
    event.target.classList.add("pressed")
    document.addEventListener("mouseup", () => {event.target.classList.remove("pressed")});
});



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

// want function to overflow at e100 and only fit up to 3 decimals in the significand / mantissa
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
        let deletionStart = preNum.length - (2 + exponentLength(preNum) + diff); // index 2 + exponentLength is right before e+00

        if (decimalIndex < 0 || decimalIndex > deletionStart) return num; 

        preNum = preNum.slice(0, deletionStart) + "" + preNum.slice(deletionStart + diff);
        if (preNum.length - preNum.indexOf("+") > 3) return num;
        return Number(preNum).toExponential(); 
    }
    return num;
} 

function exponentLength(num) {
    return -1 + (num.toString().length - num.toString().indexOf("+"));
}







// keyboard support:

document.addEventListener("keydown", (event) => { 
    const button = document.querySelector(`.${event.code}`);
    if (button) button.dispatchEvent(new CustomEvent("mousedown", {bubbles:true}));
    else if (event.code = "ShiftLeft") { 
        // temporarily disable equal key and 8
        const equalButton = document.querySelector(".Equal");
        const eightButton = document.querySelector(".Digit8");
        if (equalButton) equalButton.classList.remove("Equal");
        if (eightButton) eightButton.classList.remove("Digit8");

        function shiftLogic(shiftEvent) {
            let shiftButton;
            if (shiftEvent.code == "Equal") {
                shiftButton = document.querySelector(".Add");
                shiftButton.dispatchEvent(new CustomEvent("mousedown", {bubbles:true}));
            }
            else if (shiftEvent.code == "Digit8") {
                shiftButton = document.querySelector(".multiply");
                shiftButton.dispatchEvent(new CustomEvent("mousedown", {bubbles:true}));
            }

            document.addEventListener("keyup", (shiftEvent2) => {
                if (shiftEvent.code == shiftEvent2.code) shiftButton.dispatchEvent(new CustomEvent("mouseup", {bubbles:true}));
            })
        };

        document.addEventListener("keydown", shiftLogic);
        document.addEventListener("keyup", (upEvent) => {
            if (upEvent.code == "ShiftLeft") {
                document.removeEventListener("keydown", shiftLogic);
                if (equalButton) equalButton.classList.add("Equal");
                if (eightButton) eightButton.classList.add("Digit8");
                console.log("removed?");
            }
        });
    }
    else console.log(event.code);
        

    document.addEventListener("keyup", (event2) => {
        if (event.code == event2.code) if (button) button.dispatchEvent(new CustomEvent("mouseup", {bubbles:true}));
    })
})
// to do: 
// I don't like the behavior when hitting = and a number is on screen, or an operation. 
// 
// pink ver: #c694cd