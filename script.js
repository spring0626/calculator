const mainSc = document.querySelector(".main-screen span");
const subSc = document.querySelector(".sub-screen span");

const numberBtns = document.querySelectorAll(".number");
const symbolBtns = document.querySelectorAll(".symbol");

let firstValue = "0";
let isFirstValue = true;
let secondValue = "";
let operator;

mainSc.innerText = getBuffer();

numberBtns.forEach((btn) => {
    btn.onclick = (e) => {
        handleNumberClick(e.target.innerText);
        mainSc.innerText = getBuffer();
        handleOverflow(mainSc, 48);
        subSc.innerText = "";
    };
});

symbolBtns.forEach((btn) => {
    btn.onclick = (e) => {
        handleSymbolClick(e.target.innerText);
        mainSc.innerText = getBuffer();
        handleOverflow(mainSc, 48);
    };
});

function handleNumberClick(num) {
    if (isFirstValue) {
        firstValue = setValue(firstValue, num);
    } else {
        secondValue = setValue(secondValue, num);
    }
}

function setValue(value, num) {
    if (value == "0") {
        return num;
    }

    if (value == "-0") {
        return "-" + num;
    }

    return value + num;
}

function handleSymbolClick(symbol) {
    switch (symbol) {
        case "C":
            isFirstValue = true;
            firstValue = "0";
            secondValue = "";
            operator = "";
            subSc.innerText = "";
            break;

        case "+":
        case "-":
        case "x":
        case "÷":
            isFirstValue = false;

            if (firstValue.toString().endsWith(".")) firstValue = firstValue.slice(0, -1);

            if (secondValue) {
                subSc.innerText = getBuffer() + "=";
                handleOverflow(subSc, 24);
                firstValue = calculate(firstValue, secondValue, operator);
                secondValue = "";
            } else {
                if (firstValue == "-") firstValue += "0";
                subSc.innerText = "";
            }
            operator = symbol;
            break;

        case "=":
            if (secondValue.toString().endsWith(".")) {
                secondValue = secondValue.slice(0, -1);
            }

            if (operator && secondValue) {
                subSc.innerText = getBuffer() + "=";
                handleOverflow(subSc, 24);
                firstValue = calculate(firstValue, secondValue, operator);
                isFirstValue = true;
                secondValue = "";
                operator = "";
            }
            break;

        case "%":
            if (isFirstValue) {
                firstValue = percent(firstValue);
            } else {
                if (!secondValue) secondValue = "0";
                secondValue = percent(secondValue);
            }
            subSc.innerText = "";
            break;

        case "+/-":
            if (isFirstValue) {
                firstValue = toggleSign(firstValue);
            } else {
                if (!secondValue) secondValue = "0";
                secondValue = toggleSign(secondValue);
            }
            subSc.innerText = "";
            break;

        case ".":
            if (isFirstValue) {
                firstValue = setFloat(firstValue);
            } else {
                if (!secondValue) secondValue = "0";
                secondValue = setFloat(secondValue);
            }
            subSc.innerText = "";
            break;
    }
}

function getBuffer() {
    let buffer = firstValue;

    if (operator) {
        buffer += operator;
    }

    if (secondValue) {
        buffer += secondValue;
    }

    return buffer;
}

function calculate(num1, num2, operator) {
    let result;
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    switch (operator) {
        case "+":
            result = num1 + num2;
            break;
        case "-":
            result = num1 - num2;
            break;
        case "x":
            result = num1 * num2;
            break;
        case "÷":
            result = num1 / num2;
            break;
    }

    result = result.toString();

    if (result.includes(".")) {
        const arr = result.split(".");
        if (arr[1].length > 6) {
            arr[1] = parseFloat("0." + arr[1]).toFixed(6);
            arr[1] = arr[1].replace("0.", ".");
            result = arr[0] + arr[1];
        }
    }

    return parseFloat(result);
}

function handleOverflow(el, maxFs) {
    const parentWidth = el.parentElement.offsetWidth;
    const parentHeight = el.parentElement.offsetHeight;
    let fontSize = parseInt(window.getComputedStyle(el).fontSize);

    while (el.offsetWidth <= parentWidth && fontSize < maxFs) {
        fontSize++;
        el.style.fontSize = fontSize + "px";
    }

    while (el.offsetWidth > parentWidth || el.offsetHeight > parentHeight) {
        fontSize--;
        el.style.fontSize = fontSize + "px";
    }
}

function toggleSign(value) {
    if (value == 0) {
        return "-0";
    }

    return -value;
}

function setFloat(value) {
    value = value.toString();
    if (value.endsWith(".")) {
        return value.slice(0, -1);
    }

    return parseInt(value.replace(".", "")) + ".";
}

function percent(value) {
    if (!isNaN(value) && value != 0) {
        return value / 100;
    }

    return "0";
}
