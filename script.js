let displayValue = '0';  // Initialize the display value as '0'
const display = document.getElementById('display');  // Get the display element
let firstNumber = null;  // Stores the first number input
let secondNumber = null;  // Stores the second number input
let currentOperator = null;  // Stores the selected operator
let isSecondNumber = false;  // Tracks if we're entering the second number
let isNewCalculation = false;  // Flag to indicate start of a new calculation after pressing '='

let lastOperator = null;  // Store the last operator for repeated equals
let lastSecondNumber = null;  // Store the last second number for repeated equals

let equalsPressed = false;  // Track if equals was pressed


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

// Function to update the display when a number is clicked
function updateDisplay(value) {
    if (equalsPressed) {
        // If equals was pressed, start a new calculation
        displayValue = value;  // Reset display for the new number
        firstNumber = null;  // Clear the stored firstNumber
        lastOperator = null;  // Clear the last operator
        lastSecondNumber = null;  // Clear the last second number
        equalsPressed = false;  // Reset the equals pressed flag
    } 
        else if (isSecondNumber) {
        displayValue = value;  // Start the second number input
        isSecondNumber = false;  // Reset flag
    } else {
        displayValue = displayValue === '0' ? value : displayValue + value;  // Handle number input
    }

    // If the display exceeds 15 characters, limit it
    if (displayValue.length > 15) {
        displayValue = displayValue.slice(0, 15);  // Limit display to 15 characters
    }

    display.textContent = displayValue;  // Update display
}

function handleOperator(operator) {
    // If "-" is pressed first, start with a negative number
    if (operator === '-' && firstNumber === null && displayValue === '0') {
        displayValue = '-';  // Start entering a negative number
        display.textContent = displayValue;
        return;  // Exit early, no need to store operator yet
    }

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
    if (firstNumber !== null) {
        if (currentOperator !== null) {
            // Perform calculation if an operator is present
            secondNumber = parseFloat(displayValue);  // Store the second number
            lastSecondNumber = secondNumber;  // Store this for repeated equals
            lastOperator = currentOperator;  // Store the operator for repeated equals
            let result = operate(currentOperator, firstNumber, secondNumber);  // Perform the calculation
            result = handleOverflow(result);  // Handle overflow or rounding
            displayValue = result.toString();  // Update the display
            display.textContent = displayValue;
            firstNumber = parseFloat(displayValue);  // Store the result as firstNumber for future calculations
            currentOperator = null;  // Clear the operator
        } else if (lastOperator !== null && lastSecondNumber !== null) {
            // If no current operator but repeated equals is pressed, repeat the last operation
            let result = operate(lastOperator, firstNumber, lastSecondNumber);  // Repeat the last operation
            result = handleOverflow(result);  // Handle overflow or rounding
            displayValue = result.toString();  // Update the display
            display.textContent = displayValue;
            firstNumber = parseFloat(displayValue);  // Store the result as firstNumber
        }
        equalsPressed = true;  // Set the flag to indicate equals was pressed
        isSecondNumber = true;  // Set flag to allow new number entry
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
    isNewCalculation = false;
}

// Updated backspace function
function handleBackspace() {
    displayValue = displayValue.slice(0, -1);
    if (displayValue === '' || displayValue === '-') {
        displayValue = '0';
    }
    if (currentOperator === null) {
        firstNumber = parseFloat(displayValue);  // Update firstNumber only when no operator
    }
    display.textContent = displayValue;
}

function handlePercent() {
    if (displayValue !== '0' && !isNaN(parseFloat(displayValue))) {
        // Divide the current display value by 100 and round to avoid floating-point issues
        displayValue = roundResult(parseFloat(displayValue) / 100).toString();
        firstNumber = parseFloat(displayValue);  // Update firstNumber to the new result
        display.textContent = displayValue;  // Update the display
        currentOperator = null;  // Reset operator for new operations
        isSecondNumber = false;  // Make sure we can continue entering new numbers
    }
}

// Adjust the roundResult function to round more effectively
function roundResult(result) {
    return Math.round(result * 10000000000) / 10000000000;  // Round to 10 decimal places
}


// Function to handle the decimal point
function handleDot() {
    // If starting a new number after calculation, reset display for decimals
    if (isSecondNumber || isNewCalculation) {
        displayValue = '';  // Clear the display for the new number
        isSecondNumber = false;  // Reset flag
        isNewCalculation = false;  // Reset flag
    }

    // If the display is empty or currently showing '0', append '0.' instead of just '.'
    if (displayValue === '' || displayValue === '0') {
        displayValue = '0.';
    } else if (!displayValue.includes('.')) {
        displayValue += '.';  // Append the dot
    }

    display.textContent = displayValue;  // Update the display
}

// Rounds the result or converts to scientific notation if overflow
function handleOverflow(result) {
    const resultStr = result.toString();
    
    // Check if the number exceeds 15 characters
    if (resultStr.length > 15) {
        // Handle scientific notation for large numbers
        const scientific = result.toExponential(); // Convert to exponential form
        const [mantissa, exponent] = scientific.split('e'); // Split at 'e'
        return `${mantissa[0]}e+${(exponent.replace('+', ''))}`;  // Return in 'xey' format
    }

    // If result has decimal places, limit it to fit 15 digits
    if (!Number.isInteger(result)) {
        const roundedResult = parseFloat(result.toPrecision(15));  // Round to fit 15 digits total
        return roundedResult.toString();
    }

    return resultStr;  // Return the original result if no overflow
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
    clearDisplay();  // Reset everything on page load
};

// Add event listener for keyboard inputs
window.addEventListener('keydown', handleKeyboardInput);

function handleKeyboardInput(e) {
    const key = e.key;  // Get the key pressed

    // Check if it's a number key (0-9) or decimal point
    if (/[0-9]/.test(key)) {
        updateDisplay(key);
    } else if (key === '.') {
        handleDot();
    } else if (key === '+') {
        handleOperator('+');
    } else if (key === '-') {
        handleOperator('-');
    } else if (key === '*') {
        handleOperator('*');
    } else if (key === '/') {
        handleOperator('/');
    } else if (key === '%') {
        handlePercent();
    } else if (key === 'Backspace') {
        handleBackspace();
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();  // Prevent form submission on 'Enter'
        handleEquals();
    } else if (key === 'Escape' || key === 'Clear') {
        clearDisplay();
    } else {
        // Ignore any other key press
        return;
    }
}
