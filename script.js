//Global variables
let Display = document.getElementById('display');
let CheckSymbol = false;

// Functions Declarations
function display(num) {
     Display.value += num;
     CheckSymbol = true;
}

function operators(symbol) {
    (CheckSymbol) ? Display.value += symbol : null;
    CheckSymbol = false;
}

function calculate() {
    try{
        compute = Display.value;
        Display.value = eval(compute);
    } catch (err) {
        alert(err);
    }
}

let reset = () => Display.value  = null ;
