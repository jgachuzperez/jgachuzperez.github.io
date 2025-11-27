const display = document.getElementById('display');
const buttons = document.querySelectorAll('.num, .operator');
const equals = document.getElementById('equals');
const clear = document.getElementById('clear');
const themeBtn = document.getElementById('theme');
const mPlus = document.getElementById('mPlus');
const mMinus = document.getElementById('mMinus');
const sciBtns = document.querySelectorAll('.sci');
const toggleSci = document.getElementById('toggleSci');
const scientific = document.getElementById('scientific');

let current = '';
let memory = 0;

// Basic buttons
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        current += btn.innerText;
        display.value = current;
    });
});

// Equals
equals.addEventListener('click', () => {
    let expression = current.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    try {
        let result = eval(expression);
        display.value = result;
        saveCalculation(current, result); // Send to backend
        current = result.toString();
    } catch (e) {
        display.value = 'Error';
        current = '';
    }
});

// Clear
clear.addEventListener('click', () => {
    current = '';
    display.value = '';
});

// Theme toggle
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

// Memory buttons
mPlus.addEventListener('click', () => { memory += parseFloat(display.value) || 0; });
mMinus.addEventListener('click', () => { memory -= parseFloat(display.value) || 0; });

// Scientific functions
sciBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        let val = parseFloat(display.value) || 0;
        let res = 0;
        switch(btn.innerText) {
            case 'sin': res = Math.sin(val); break;
            case 'cos': res = Math.cos(val); break;
            case 'log': res = Math.log(val); break;
        }
        display.value = res;
        current = res.toString();
        saveCalculation(btn.innerText + '(' + val + ')', res);
    });
});

toggleSci.addEventListener('click', () => {
    scientific.classList.toggle('hidden');
});

// Save calculation to backend
function saveCalculation(expression, result) {
    fetch('http://localhost:3000/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expression, result })
    })
    .then(res => res.json())
    .then(data => console.log('Saved:', data))
    .catch(err => console.error(err));
}

// Keyboard support
document.addEventListener('keydown', e => {
    if (!isNaN(e.key) || e.key === '.') current += e.key;
    if (['+', '-', '*', '/'].includes(e.key)) current += e.key;
    if (e.key === 'Enter') equals.click();
    if (e.key === 'Backspace') current = current.slice(0, -1);
    display.value = current;
});
