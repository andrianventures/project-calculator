let displayValue = '0';  // Initialize the display value as '0'
const display = document.getElementById('display');  // Get the display element
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
        return 'ERROR';  // Error message for division by zero
    }
}

function operate(operator, num1, num2) {
    let result;
    switch (operator) {
        case '+':
            result = add(num1, num2);
            break;
        case '-':
            result = subtract(num1, num2);
            break;
        case '*':
            result = multiply(num1, num2);
            break;
        case '/':
            result = divide(num1, num2);
            break;
        default:
            return 'ERROR';
    }
    return roundResult(result);  // Ensure result is rounded
}

// Update display when a number is clicked
function updateDisplay(value) {
    if (isSecondNumber) {
        displayValue = value;  // Start the second number input
        isSecondNumber = false;  // Reset flag
    } else {
        displayValue = displayValue === '0' ? value : displayValue + value;  // Handle number input
    }
    display.textContent = displayValue;  // Update display
}

// Function to handle operator click
function handleOperator(operator) {
    if (firstNumber === null) {
        firstNumber = parseFloat(displayValue);
    } else if (currentOperator) {
        secondNumber = parseFloat(displayValue);
        const result = operate(currentOperator, firstNumber, secondNumber);
        displayValue = result.toString();
        display.textContent = displayValue;
        firstNumber = result;  // Set result as first number for the next calculation
    }
    currentOperator = operator;
    isSecondNumber = true;
}

// Function to handle equals button click
function handleEquals() {
    if (firstNumber !== null && currentOperator !== null) {
        secondNumber = parseFloat(displayValue);
        let result = operate(currentOperator, firstNumber, secondNumber);
        result = handleOverflow(result);  // Check for overflow
        displayValue = result.toString();  // Show the result
        display.textContent = displayValue;
        firstNumber = result;  // Store result as firstNumber
        currentOperator = null;  // Clear operator
        isSecondNumber = false;
    }
}

// Clear the display and reset all values
function clearDisplay() {
    displayValue = '0';
    firstNumber = null;
    secondNumber = null;
    currentOperator = null;
    display.textContent = '0';
    isSecondNumber = false;
}

// Updated backspace function
function handleBackspace() {
    displayValue = displayValue.slice(0, -1);
    if (displayValue === '' || displayValue === '-') {
        displayValue = '0';
    }
    firstNumber = parseFloat(displayValue);  // Update firstNumber
    display.textContent = displayValue;
}

// Function to handle percent
function handlePercent() {
    if (displayValue !== '0' && !isNaN(parseFloat(displayValue))) {
        // Divide the current display value by 100
        displayValue = (parseFloat(displayValue) / 100).toString();
        firstNumber = parseFloat(displayValue);  // Update firstNumber to the new result
        display.textContent = displayValue;  // Update the display
        currentOperator = null;  // Reset operator for new operations
        isSecondNumber = false;  // Make sure we can continue entering new numbers
    }
}

// Function to handle decimal input
function handleDot() {
    if (!displayValue.includes('.')) {
        displayValue += '.';
        display.textContent = displayValue;
    }
}

// Rounds the result to 10 decimal places if needed
function roundResult(result) {
    if (typeof result === 'number' && !Number.isInteger(result)) {
        return parseFloat(result.toFixed(10));
    }
    return result;
}

// Handles overflow for large results
function handleOverflow(result) {
    if (result.toString().length > 10) {
        return 'E';  // Return overflow message for large numbers
    }
    return result;
}

// Event listeners for buttons
const numberButtons = document.querySelectorAll('.number');
numberButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        updateDisplay(e.target.textContent);
    });
});

const operatorButtons = document.querySelectorAll('.operator');
operatorButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        let operator = e.target.textContent;
        if (operator === '÷') operator = '/';
        if (operator === '×') operator = '*';
        handleOperator(operator);
    });
});

document.getElementById('equals').addEventListener('click', handleEquals);
document.getElementById('clear').addEventListener('click', clearDisplay);
document.getElementById('backspace').addEventListener('click', handleBackspace);
document.getElementById('percent').addEventListener('click', handlePercent);
document.getElementById('decimal').addEventListener('click', handleDot);

window.onload = () => {
    display.textContent = '0';
};
