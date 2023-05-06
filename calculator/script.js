const calculator = document.querySelector('.calculator');
const result = calculator.querySelector('.result');
const numberButtons = calculator.querySelectorAll('.number');
const operatorButtons = calculator.querySelectorAll('.operator');
const clearButton = calculator.querySelector('.clear');
const calculateButton = calculator.querySelector('.calculate');
const decimalButton = calculator.querySelector('.decimal');
const backspaceButton = calculator.querySelector('.backspace')

let currentNumber = '';
let firstOperand = null;
let operator = null;

function insertNumber(number) {
  const validNumber = /^(\d*\.)?\d{0,8}$/.test(currentNumber + number);
  if (result.value === null) {
    result.value = '0';
  }
  if (result.value === '0' || result.value === 'Error' || result.value === null) {
    result.value = validNumber ? currentNumber + number : 'Error';
  } else if (number !== '.' || currentNumber === '' || !currentNumber.includes('.')) {
    currentNumber += number;
    result.value = validNumber ? currentNumber : 'Error';
  }
}

function selectOperator(selectedOperator) {
  if (currentNumber === '') {
    return;
  }

  if (firstOperand === null) {
    firstOperand = parseFloat(currentNumber);
    operator = selectedOperator;
  } else {
    const secondOperand = parseFloat(currentNumber);
    if (isNaN(secondOperand)) {
      result.value = 'Error';
      return;
    }
    const calculatedValue = calculate(firstOperand, operator, secondOperand);
    if (calculatedValue === null || isNaN(calculatedValue)) {
      result.value = 'Error';
      return;
    }
    firstOperand = calculatedValue;
    operator = selectedOperator;
    result.value += selectedOperator;
  }

  currentNumber = '';
}

function calculate(firstOperand, operator, secondOperand) {
  switch (operator) {
    case '+':
      return firstOperand + secondOperand;
    case '-':
      return firstOperand - secondOperand;
    case '*':
      return firstOperand * secondOperand;
    case '/':
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
  currentNumber = '';
  firstOperand = null;
  operator = null;
  result.value = null;
}

function backspace() {
  currentNumber = currentNumber.slice(0, -1);
  result.value = result.value.slice(0, -1);
}

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    insertNumber(button.innerText);
  });
});

operatorButtons.forEach(button => {
  button.addEventListener('click', () => {
    selectOperator(button.innerText);
  });
});

clearButton.addEventListener('click', clearResult);

calculateButton.addEventListener('click', () => {
  if (operator !== null && currentNumber !== '') {
    const secondOperand = parseFloat(currentNumber);
    const calculatedValue = calculate(firstOperand, operator, secondOperand);
    currentNumber = '';
    operator = null;
    firstOperand = calculatedValue;
    result.value = calculatedValue;
  }
});

decimalButton.addEventListener('click', () => {
  if (!currentNumber.includes('.')) {
    currentNumber += '.';
    result.value += '.';
  }
});

backspaceButton.addEventListener('click', backspace);

document.addEventListener('keydown', event => {
  const key = event.key;
  if (/\d/.test(key)) {
    insertNumber(key);
  } else if (/[\+\-\*\/]/.test(key)) {
    selectOperator(key);
  } else if (key === 'Enter') {
    calculateButton.click();
  } else if (key === '.') {
    decimalButton.click();
  } else if (key === 'Backspace') {
    backspace();
  }
});