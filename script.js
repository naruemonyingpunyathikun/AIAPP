// สถานะของเครื่องคิดเลข
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};

// อัปเดตหน้าจอแสดงผล
function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculator.displayValue;
}

updateDisplay();

// จัดการการคลิกปุ่ม
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    const { target } = event;

    // ถ้าไม่ใช่ปุ่ม ให้หยุด
    if (!target.matches('button')) {
        return;
    }

    // เรียกใช้ฟังก์ชันตามชนิดของปุ่ม
    if (target.classList.contains('operator')) {
        handleOperator(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('decimal')) {
        inputDecimal(target.value);
        updateDisplay();
        return;
    }

    if (target.classList.contains('all-clear')) {
        resetCalculator();
        updateDisplay();
        return;
    }

    inputDigit(target.value);
    updateDisplay();
});

// ฟังก์ชันสำหรับตัวเลข
function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        // ถ้าเป็น '0' ให้แทนที่ด้วยตัวเลขใหม่, ถ้าไม่ใช่ให้ต่อท้าย
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
}

// ฟังก์ชันสำหรับจุดทศนิยม
function inputDecimal(dot) {
    // ป้องกันการใส่จุดทศนิยมซ้ำ หากมีตัวเลขที่รอการคำนวณอยู่
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = '0.';
        calculator.waitingForSecondOperand = false;
        return;
    }

    // ป้องกันการมีจุดทศนิยมซ้ำในค่าที่แสดงอยู่
    if (!calculator.displayValue.includes(dot)) {
        calculator.displayValue += dot;
    }
}

// ฟังก์ชันจัดการตัวดำเนินการ (+, -, *, /)
function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculator;
    const inputValue = parseFloat(displayValue);

    // ถ้ามีตัวดำเนินการอยู่แล้ว และรอตัวเลขตัวที่สองอยู่ ให้เปลี่ยนตัวดำเนินการ
    if (operator && calculator.waitingForSecondOperand) {
        calculator.operator = nextOperator;
        return;
    }

    // ถ้ายังไม่มีตัวถูกดำเนินการตัวแรก ให้กำหนดค่าที่แสดงเป็นตัวแรก
    if (firstOperand === null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        // ถ้ามีตัวถูกดำเนินการตัวแรก และมีตัวดำเนินการ ให้คำนวณผลลัพธ์
        const result = performCalculation[operator](firstOperand, inputValue);

        // จัดการทศนิยมและแสดงผล
        calculator.displayValue = String(parseFloat(result.toFixed(7))); // จำกัดทศนิยม
        calculator.firstOperand = result;
    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}

// วัตถุที่ใช้เก็บฟังก์ชันคำนวณ
const performCalculation = {
    '/': (firstOperand, secondOperand) => firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
    '=': (firstOperand, secondOperand) => secondOperand, // ปุ่ม '=' จะใช้ค่า secondOperand เป็นผลลัพธ์สุดท้าย
};

// ฟังก์ชันรีเซ็ตเครื่องคิดเลข (ปุ่ม AC)
function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}