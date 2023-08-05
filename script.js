const mainSc = document.querySelector(".main-screen span");
const subSc = document.querySelector(".sub-screen span");

const numberBtns = document.querySelectorAll(".number");
const symbolBtns = document.querySelectorAll(".symbol");

let firstValue = "0";
let isFirstValue = true;
let secondValue = "";
let operator;

mainSc.innerText = getBuffer();

numberBtns.forEach((numberBtns) => {
    numberBtns.onclick = (e) => {
        handleNumberClick(e.target.innerText);
        mainSc.innerText = getBuffer();
        handleOverflow(mainSc, 48);
        subSc.innerText = "";
    };
});

symbolBtns.forEach((symbolBtn) => {
    symbolBtn.onclick = (e) => {
        handleSymbolClick(e.target.innerText);
        mainSc.innerText = getBuffer();
        handleOverflow(mainSc, 48);
    };
});

function handleNumberClick(num) {
    if (isFirstValue) {
        if (firstValue == "0") {
            firstValue = num;
        } else if (firstValue == "-0") {
            firstValue = "-" + num;
        } else {
            firstValue += num;
        }
    } else {
        secondValue += num;
    }
}

function handleSymbolClick(symbol) {
    switch (symbol) {
        case "AC":
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

            if (firstValue.toString().endsWith(".")) {
                firstValue = firstValue.slice(0, -1);
            }

            if (secondValue) {
                subSc.innerText = getBuffer() + "=";
                handleOverflow(subSc, 24);
                firstValue = calculate(firstValue, secondValue, operator).toString();
                secondValue = "";
            } else {
                if (firstValue == "-") {
                    firstValue += "0";
                }
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
                firstValue = calculate(firstValue, secondValue, operator).toString();
                isFirstValue = true;
                secondValue = "";
                operator = "";
            }
            break;

        case "%":
            if (isFirstValue) {
                if (!isNaN(firstValue)) firstValue = parseFloat(firstValue) / 100;
            } else if (secondValue) {
                if (!isNaN(secondValue)) secondValue = parseFloat(secondValue) / 100;
            }
            subSc.innerText = "";
            break;

        case "+/-":
            if (isFirstValue) {
                firstValue = toggleSign(firstValue);
            } else {
                secondValue = toggleSign(secondValue);
            }
            subSc.innerText = "";
            break;

        case ".":
            if (isFirstValue) {
                firstValue = setFloat(firstValue);
            } else {
                if (secondValue) secondValue = setFloat(secondValue);
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

    if (result.toString().length > 6) {
        result = result.toFixed(6);
    }

    return result;
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
    if (value == "0") {
        value = "-" + value;
    } else {
        if (!isNaN(value)) value = -parseFloat(value);
    }
    return value;
}

function setFloat(value) {
    value = value.toString();
    if (value.endsWith(".")) {
        value = value.slice(0, -1);
    } else {
        value = value.replace(".", "");
        value += ".";
    }

    return value;
}
