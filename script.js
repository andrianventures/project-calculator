let displayValue = ''; // Variable to store the display value
const display = document.getElementById('display'); // Get the display element
let firstNumber = null;  // Stores the first number input
let secondNumber = null;  // Stores the second number input
let currentOperator = null;  // Stores the selected operator
let isSecondNumber = false;  // Tracks if we're entering the second number

// Math functions
function add(num1, num2) {
    return num1 + num2;
}

function subtract(num1, num2) {
    return num1 - num2;
}

function multiply(num1, num2) {
    return num1 * num2;
}

function divide(num1, num2) {
    if (num2 !== 0) {
        return num1 / num2;
    } else {
        return 'MAGA';  // Error message for division by zero
    }
}

function percent(num1) {
    return num1 / 100;
}

function operate(operator, num1, num2) {
    switch (operator) {
        case '+':
            return add(num1, num2);
        case '-':
            return subtract(num1, num2);
        case '*':
            return multiply(num1, num2);
        case '/':
            return divide(num1, num2);
        default:
            return 'ERROR';
    }
}

// Function to update the display when a number button is clicked
function updateDisplay(value) {
    if (isSecondNumber) {
        displayValue = '';  // Clear display when starting the second number
        isSecondNumber = false;
    }
    displayValue += value;  // Append clicked number
    display.textContent = displayValue;  // Update display text
}

// Function to handle when an operator is clicked
function handleOperator(operator) {
    if (firstNumber === null) {
        firstNumber = parseFloat(displayValue);  // Store the first number
    } else if (currentOperator) {
        secondNumber = parseFloat(displayValue);  // Store the second number
        const result = operate(currentOperator, firstNumber, secondNumber);  // Perform operation
        displayValue = result.toString();  // Convert result to string for display
        display.textContent = displayValue;  // Update display with result
        firstNumber = result;  // Store the result as the first number for further operations
    }
    currentOperator = operator;  // Store the selected operator
    isSecondNumber = true;  // Now we start entering the second number
}

// Function to handle when the "=" button is clicked
function handleEquals() {
    if (firstNumber !== null && currentOperator !== null) {
        secondNumber = parseFloat(displayValue);  // Store the second number
        const result = operate(currentOperator, firstNumber, secondNumber);  // Perform operation
        displayValue = result.toString();  // Convert result to string for display
        display.textContent = displayValue;  // Update display with result
        firstNumber = result;  // Store the result for further operations
        currentOperator = null;  // Reset the operator
        isSecondNumber = true;  // Reset the flag for the next input
    }
}

// Function to clear everything
function clearDisplay() {
    displayValue = '';  // Reset display value
    firstNumber = null;  // Clear first number
    secondNumber = null;  // Clear second number
    currentOperator = null;  // Clear operator
    display.textContent = '0';  // Reset display to default
    isSecondNumber = false;  // Reset input flag
}

// Adding event listeners to the number buttons
const numberButtons = document.querySelectorAll('.number');
numberButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        updateDisplay(e.target.textContent);  // Update display with clicked number
    });
});

// Adding event listeners to the operator buttons
const operatorButtons = document.querySelectorAll('.operator');
operatorButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        handleOperator(e.target.textContent);  // Handle operator input
    });
});

// Adding event listener to the equals button
const equalsButton = document.getElementById('equals');
equalsButton.addEventListener('click', handleEquals);

// Adding event listener to the clear button
const clearButton = document.getElementById('clear');
clearButton.addEventListener('click', clearDisplay);

// Function to handle backspace
function handleBackspace() {
    displayValue = displayValue.slice(0, -1); // Remove last digit
    if (displayValue === '') displayValue = '0'; // Default to '0' if empty
    display.textContent = displayValue;
}

// Adding event listener to the backspace button
const backspaceButton = document.getElementById('backspace');
backspaceButton.addEventListener('click', handleBackspace);

// Function to handle percent
function handlePercent() {
    displayValue = (parseFloat(displayValue) / 100).toString(); // Divide by 100
    display.textContent = displayValue;
}

// Adding event listener to the percent button
const percentButton = document.getElementById('percent');
percentButton.addEventListener('click', handlePercent);

// Function to handle the decimal point
function handleDot() {
    if (!displayValue.includes('.')) { // Only allow one dot
        displayValue += '.';
        display.textContent = displayValue;
    }
}

// Adding event listener to the dot button
const dotButton = document.getElementById('dot');
dotButton.addEventListener('click', handleDot);

