const calculator = document.querySelector('.calculator');
const calculatorScreen = document.querySelector('.calculator-screen');
const keys = document.querySelector('.calculator-keys');

let prevValue = '';
let currentValue = '0';
let operator = '';
let waitingForSecondOperand = false; // ตรวจสอบว่ารอตัวเลขตัวที่สองหรือไม่

function updateScreen(value) {
    calculatorScreen.value = value;
}

function handleNumber(number) {
    if (waitingForSecondOperand) {
        currentValue = number;
        waitingForSecondOperand = false;
    } else {
        currentValue = currentValue === '0' ? number : currentValue + number;
    }
    updateScreen(currentValue);
}

function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentValue);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (prevValue === '') {
        prevValue = inputValue;
    } else if (operator) {
        const result = operate(prevValue, inputValue, operator);
        currentValue = String(result);
        prevValue = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
    updateScreen(currentValue); // แสดงผลลัพธ์บางส่วน หรือตัวเลขแรก
}

function operate(num1, num2, op) {
    switch (op) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '*':
            return num1 * num2;
        case '/':
            return num1 / num2;
        case 'power':
            return Math.pow(num1, 2); // สำหรับ x^2
        default:
            return num2;
    }
}

function resetCalculator() {
    prevValue = '';
    currentValue = '0';
    operator = '';
    waitingForSecondOperand = false;
    updateScreen(currentValue);
}

keys.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        if (target.value === 'power') {
            const inputValue = parseFloat(currentValue);
            currentValue = String(Math.pow(inputValue, 2));
            updateScreen(currentValue);
            prevValue = currentValue; // อัปเดต prevValue หลังจากยกกำลัง
            waitingForSecondOperand = true; // เตรียมพร้อมสำหรับตัวดำเนินการถัดไป
            operator = ''; // ล้าง operator หลังจากยกกำลัง
            return;
        } else if (target.value === '=') {
            if (prevValue !== '' && operator !== '' && !waitingForSecondOperand) {
                const result = operate(prevValue, parseFloat(currentValue), operator);
                currentValue = String(result);
                updateScreen(currentValue);
                prevValue = '';
                operator = '';
                waitingForSecondOperand = false;
            }
            return;
        }
        handleOperator(target.value);
        return;
    }

    if (target.classList.contains('decimal')) {
        if (!currentValue.includes('.')) {
            currentValue += '.';
            updateScreen(currentValue);
        }
        return;
    }

    if (target.classList.contains('clear')) {
        resetCalculator();
        return;
    }

    handleNumber(target.value);
});

// เริ่มต้นหน้าจอด้วยค่า '0'
updateScreen(currentValue);