//Global variables
const MathOperators = ['+', '-', '*', '/'];

let IsReset = true;
let CheckSymbol = true;
let Display = document.getElementById('display');

Display.addEventListener("input", (e) => {
    validateState();
    scrollDisplayToRight();

    if (IsReset) {
        let newValue = e.target.value;
        Display.value = newValue.substring(1);
        IsReset = false;
    }
});

// Functions Declarations
function validateState() {
    if (Display.value === "") {
        Display.value = 0;
        IsReset = true;
        console.log(`${IsReset}`);
    }

    let lastCharacter = getLastCharacter(Display.value);
    CheckSymbol = !MathOperators.includes(lastCharacter);
}

function display(num) {
    let shouldReplaceNumberZero = (Display.value === '0');
    Display.value = (shouldReplaceNumberZero) ? num : (Display.value + num);
    CheckSymbol = true;
    IsReset = false;
    scrollDisplayToRight();
}

function operators(symbol) {
    switch (symbol) {
        case '+/-': {
            let lastMathOperatorIndex = getLastMathOperatorIndex(Display.value);

            if (lastMathOperatorIndex === undefined) {
                Display.value = -Display.value;
                return;
            }

            let mathOperator = Display.value[lastMathOperatorIndex];

            if (mathOperator === '+') {
                Display.value = setCharAt(Display.value, lastMathOperatorIndex, '-');
            }
            else if (mathOperator === '-') {
                let beforeLastMathOperatorCharacter = Display.value[lastMathOperatorIndex - 1];
                let shouldRemoveMinusSymbol = MathOperators.includes(beforeLastMathOperatorCharacter);

                if (shouldRemoveMinusSymbol) {
                    Display.value = setCharAt(Display.value, lastMathOperatorIndex, '');
                }
                else {
                    let isMathOperatorIsTheFirstText = (lastMathOperatorIndex === 0);

                    if (isMathOperatorIsTheFirstText) {
                        Display.value = setCharAt(Display.value, lastMathOperatorIndex, '');
                    }
                    else {
                        Display.value = setCharAt(Display.value, lastMathOperatorIndex, '+');
                    }
                }
            }
            else {
                let afterLastMathOperatorCharacter = Display.value[lastMathOperatorIndex + 1];
                let shouldAddMinusSymbol = !MathOperators.includes(afterLastMathOperatorCharacter);

                if (shouldAddMinusSymbol) {
                    Display.value = addCharAt(Display.value, lastMathOperatorIndex + 1, '-');
                }
                else {
                    Display.value = setCharAt(Display.value, lastMathOperatorIndex + 1, '');
                }
            }
        }
        break;

        case '.': {
            let lastCharacter = getLastCharacter(Display.value);
            let canPrependZero = MathOperators.includes(lastCharacter);
            let shouldAppendSymbol = !canPrependZero;

            if (canPrependZero) {
                Display.value += `0${symbol}`;
            }
            else if (shouldAppendSymbol) {
                // Handle invalid case '0..'
                let isPassFirstTest = (lastCharacter !== '.');

                // Handle invalid case '0.2.4', '-0.2.4'
                let isPassSecondTest = false;
                let totalSymbol = 0;
                let lastMathOperatorIndex = getLastMathOperatorIndex(Display.value);
                let startCheckingIndex = (lastMathOperatorIndex) ? lastMathOperatorIndex : 0;

                for (let i = startCheckingIndex; i < Display.value.length; i++) {
                    let character = Display.value[i];

                    if (character === '.') {
                        totalSymbol += 1;
                    }
                }

                isPassSecondTest = (totalSymbol < 1);

                let canAppendSymbol = (isPassFirstTest && isPassSecondTest);

                if (canAppendSymbol)
                {
                    Display.value += symbol;
                }
            }
        }
        break;

        default: {
            let lastCharacter = getLastCharacter(Display.value);
            let shouldRemoveComma = (lastCharacter == '.');

            if (shouldRemoveComma) {
                Display.value = Display.value.slice(0, Display.value.length - 1);
            }

            if (CheckSymbol) {
                Display.value += symbol;
            }
        }
        break;
    }

    validateState();
    scrollDisplayToRight();
}

function calculate() {
    try{
        compute = Display.value;
        let result = eval(compute);
        let roundResult = Math.round(result * 100000000) / 100000000; // 8 percision
        Display.value = roundResult;
        validateState();
    } catch (err) {
        alert(err);
    }

    scrollDisplayToBeginning();
}

function reset() {
    Display.value = 0;
    CheckSymbol = true;
    IsReset = true;
}

function resetEntry() {
    const lastOperatorIndex = getLastMathOperatorIndex(Display.value);

    if (lastOperatorIndex) {
        let value = Display.value.slice(0, lastOperatorIndex + 1);
        Display.value = value;
    } else {
        reset();
    }

    validateState();
}

function removeCharacter() {
    const endIndex = (Display.value.length - 1);
    Display.value = Display.value.slice(0, endIndex);
    validateState();
}

function getLastCharacter(text) {
    return text.slice(-1);
}

function getLastMathOperatorIndex(text) {
    const regex = /(?:\+|\-|\*|\/)(?!.*(?:\+|\-|\*|\/))/;
    return regex.exec(text)?.index;
}

function scrollDisplayToRight() {
    Display.scrollLeft = Display.scrollWidth;
}

function scrollDisplayToBeginning() {
    Display.scrollLeft = 0;
}

function setCharAt(str, index, chr) {
    if (index > str.length - 1) {
        return str;
    }

    return str.substring(0, index) + chr + str.substring(index + 1);
}

function addCharAt(str, index, chr) {
    if (index > str.length - 1) {
        return str;
    }

    let a = str.slice(0, index);
    let b = chr;
    let c = str.slice(index, str.length);

    return (a + b + c);
}

if (navigator.serviceWorker) {
    // Start registration process on every page load
    window.addEventListener('load', () => {
        navigator.serviceWorker
            // The register function takes as argument
            // the file path to the worker's file
            .register('./sw.js')
            // Gives us registration object
            .then(reg => console.log('Service Worker Registered'))
            .catch(swErr => console.log(
                  `Service Worker Installation Error: ${swErr}}`));
      });
}