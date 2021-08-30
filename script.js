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