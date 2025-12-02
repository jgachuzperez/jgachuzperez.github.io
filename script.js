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

let current = '';  //Current input
let memory = 0;    //Memory value

//Basic Number and Operator Buttons
buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        current += btn.innerText;
        display.value = current;
    });
});

//Equals Button
equals.addEventListener('click', () => {
    try {
        //Replace symbols with JS operators
        let expression = current.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        let result = eval(expression);
        display.value = result;
        current = result.toString();
    } catch (e) {
        display.value = 'Error';
        current = '';
    }
});

//Clear Button
clear.addEventListener('click', () => {
    current = '';
    display.value = '';
});

//Theme Toggle
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
});

//Memory Functions
mPlus.addEventListener('click', () => {
    memory += parseFloat(display.value) || 0;
});

mMinus.addEventListener('click', () => {
    memory -= parseFloat(display.value) || 0;
});

//Scientific Functions
sciBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        let val = parseFloat(display.value) || 0;
        let res = 0;
        switch (btn.innerText) {
            case 'sin': res = Math.sin(val); break;
            case 'cos': res = Math.cos(val); break;
            case 'log': res = Math.log(val); break;
        }
        display.value = res;
        current = res.toString();
    });
});

//Toggle Scientific Panel
toggleSci.addEventListener('click', () => {
    scientific.classList.toggle('hidden');
});

//Keyboard Support
document.addEventListener('keydown', e => {
    if (!isNaN(e.key) || e.key === '.') {
        current += e.key;
    } else if (['+', '-', '*', '/'].includes(e.key)) {
        current += e.key;
    } else if (e.key === 'Enter') {
        equals.click();
    } else if (e.key === 'Backspace') {
        current = current.slice(0, -1);
    }
    display.value = current;
});
