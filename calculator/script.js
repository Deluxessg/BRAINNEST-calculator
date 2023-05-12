const calculator = document.querySelector(".calculator");
const numberButtons = calculator.querySelectorAll(".number");
const operatorButtons = calculator.querySelectorAll(".operator");
const clearButton = calculator.querySelector(".clear");
const calculateButton = calculator.querySelector(".calculate");
const decimalButton = calculator.querySelector(".decimal");
const backspaceButton = calculator.querySelector(".backspace");
const displayEquation = document.querySelector(".equation");
const displayResult = document.querySelector(".result");

clearResult();

function insertNumber(number) {
    const validNumber = /^(\d*\.)?\d{0,8}$/.test(currentNumber + number);
    if (resultValue === null) {
        resultValue = "0";
    }
    if (
        resultValue === "0" ||
        resultValue === "Error" ||
        resultValue === null
    ) {
        resultValue = validNumber ? currentNumber + number : "Error";
        currentNumber += resultValue;
    } else if (
        number !== "." ||
        currentNumber === "" ||
        !currentNumber.includes(".")
    ) {
        currentNumber += number;
        resultValue = validNumber ? currentNumber : "Error";
    }
    if (
        operator &&
        (number === "+" || number === "-" || number === "*" || number === "/")
    ) {
        equation += operator;
    }

    equation += number;
    displayEquation.innerHTML = equation;
}

function selectOperator(selectedOperator) {
    if (currentNumber === "") {
        return;
    }
    if (firstOperand === null) {
        firstOperand = parseFloat(currentNumber);
        operator = selectedOperator;
    } else {
        const secondOperand = parseFloat(currentNumber);
        if (isNaN(secondOperand)) {
            resultValue = "Error";
            return;
        }
        const calculatedValue = calculate(
            firstOperand,
            operator,
            secondOperand
        );
        if (calculatedValue === null || isNaN(calculatedValue)) {
            resultValue = "Error";
            return;
        }
        firstOperand = calculatedValue;
        operator = selectedOperator;
        resultValue = calculatedValue;
    }

    currentNumber = "";
    equation += selectedOperator;
}

function calculate(firstOperand, operator, secondOperand) {
    switch (operator) {
        case "+":
            return firstOperand + secondOperand;
        case "-":
            return firstOperand - secondOperand;
        case "*":
            return firstOperand * secondOperand;
        case "/":
            if (secondOperand === 0) {
                return "you CAN'T do that";
            } else {
                return firstOperand / secondOperand;
            }
        default:
            return null;
    }
}

function clearResult() {
    currentNumber = "";
    firstOperand = null;
    operator = null;
    resultValue = null;
    equation = "";
    displayEquation.innerHTML = "&nbsp;";
    displayResult.innerHTML = 0;
    displayResult.focus();
}

function backspace() {
    currentNumber = currentNumber.slice(0, -1);
    resultValue = resultValue.slice(0, -1);
    equation = equation.slice(0, -1);
}

numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
        insertNumber(button.innerText);
        displayEquation.innerHTML = equation;
        displayResult.innerHTML = resultValue;
    });
});

operatorButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (!isNaN(equation.slice(-1))) {
            selectOperator(button.innerText);
            displayEquation.innerHTML = equation;
            displayResult.innerHTML = resultValue;
        }
    });
});

clearButton.addEventListener("click", () => {
    clearResult();
});

calculateButton.addEventListener("click", () => {
    if (operator !== null && currentNumber !== "") {
        const secondOperand = parseFloat(currentNumber);
        const calculatedValue = calculate(
            firstOperand,
            operator,
            secondOperand
        );
        currentNumber = calculatedValue.toString();
        if (isNaN(calculatedValue)) {
            resultValue = "Error";
        } else {
            resultValue = calculatedValue.toString();
        }
        firstOperand = null;
        operator = null;
    }
    displayResult.innerHTML = resultValue;
});

decimalButton.addEventListener("click", () => {
    if (currentNumber === "") {
        currentNumber = "0";
    }
    if (!currentNumber.includes(".")) {
        currentNumber += ".";
        resultValue = currentNumber;
    } else {
        resultValue = "Error";
    }
    displayResult.innerHTML = resultValue;
});

backspaceButton.addEventListener("click", () => {
    if (currentNumber !== "") {
        currentNumber = currentNumber.slice(0, -1);
        resultValue = resultValue.slice(0, -1);
        equation = equation.slice(0, -1);
    }
    displayEquation.innerHTML = equation;
    displayResult.innerHTML = resultValue;
});

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (/\d/.test(key)) {
        insertNumber(key);
    } else if (/[\+\-\*\/]/.test(key)) {
        selectOperator(key);
    } else if (key === "Enter") {
        calculateButton.click();
    } else if (key === ".") {
        decimalButton.click();
    } else if (key === "Backspace") {
        backspace();
    }
});
