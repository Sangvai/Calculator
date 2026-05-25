const display = document.getElementById('display');
let currentInput = '0';
let previousInput = '';
let operator = null;
let waitingForOperand = false;

function updateDisplay() {
    display.innerText = currentInput;
}

function inputNumber(num) {
    if (waitingForOperand) {
        currentInput = num.toString();
        waitingForOperand = false;
    } else {
        currentInput = currentInput === '0' ? num.toString() : currentInput + num;
    }
    updateDisplay();
}

function inputDecimal() {
    if (waitingForOperand) {
        currentInput = '0.';
        waitingForOperand = false;
        updateDisplay();
        return;
    }
    if (!currentInput.includes('.')) {
        currentInput += '.';
        updateDisplay();
    }
}

function deleteLast() {
    if (waitingForOperand) return;
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    waitingForOperand = false;
    updateDisplay();
}

function calculate() {
    if (operator === null || waitingForOperand) return;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    if (isNaN(prev) || isNaN(current)) return;
    let result = 0;
    if (operator === '+') result = prev + current;
    else if (operator === '-') result = prev - current;
    else if (operator === '×') result = prev * current;
    else if (operator === '÷') {
        if (current === 0) {
            alert('Cannot divide by zero');
            clearAll();
            return;
        }
        result = prev / current;
    }
    result = Math.round(result * 10000000) / 10000000;
    currentInput = result.toString();
    operator = null;
    waitingForOperand = true;
    updateDisplay();
}

function handleOperator(nextOp) {
    if (operator && waitingForOperand) {
        operator = nextOp;
        return;
    }
    if (previousInput !== '' && operator !== null) {
        calculate();
    }
    previousInput = currentInput;
    operator = nextOp;
    waitingForOperand = true;
}

const digits = ['0','1','2','3','4','5','6','7','8','9'];
for(let i = 0; i < digits.length; i++) {
    const btn = document.getElementById(digits[i]);
    if(btn) {
        btn.addEventListener('click', (function(d) {
            return function() { inputNumber(parseInt(d)); };
        })(digits[i]));
    }
}

document.getElementById('decimal').addEventListener('click', inputDecimal);
document.getElementById('clear').addEventListener('click', clearAll);
document.getElementById('delete').addEventListener('click', deleteLast);
document.getElementById('add').addEventListener('click', () => handleOperator('+'));
document.getElementById('subtract').addEventListener('click', () => handleOperator('-'));
document.getElementById('multiply').addEventListener('click', () => handleOperator('×'));
document.getElementById('divide').addEventListener('click', () => handleOperator('÷'));
document.getElementById('equals').addEventListener('click', () => {
    if(operator && !waitingForOperand) calculate();
    operator = null;
});

updateDisplay();