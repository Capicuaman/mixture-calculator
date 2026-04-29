const BASE_VALUES = {
    magnesium: 275,
    potassium: 680,
    sodium: 9500,
    total: 10455
};

const inputMg = document.getElementById('magnesium');
const inputK = document.getElementById('potassium');
const inputNa = document.getElementById('sodium');
const inputTotal = document.getElementById('total');
const resetBtn = document.getElementById('reset-btn');
const printBtn = document.getElementById('print-btn');

function formatWithCommas(val) {
    if (val === '' || val === null || val === undefined) return '';
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    
    // Format with commas, max 2 decimal places
    return num.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function parseCommas(str) {
    if (typeof str !== 'string') return str;
    return parseFloat(str.replace(/,/g, ''));
}



function calculateFrom(sourceId, value) {
    const rawValue = parseCommas(value);
    
    if (value === '' || isNaN(rawValue)) {
        [inputMg, inputK, inputNa, inputTotal].forEach(input => {
            if (input.id !== sourceId) input.value = '';
        });
        return;
    }

    let numValue = rawValue;
    
    // Prevent negative numbers
    if (numValue < 0) {
        numValue = 0;
        document.getElementById(sourceId).value = 0;
    }

    const sourceBase = BASE_VALUES[sourceId];
    
    // Calculate ratio relative to base
    const ratio = numValue / sourceBase;

    // Update other inputs
    if (sourceId !== 'magnesium') inputMg.value = formatWithCommas(ratio * BASE_VALUES.magnesium);
    if (sourceId !== 'potassium') inputK.value = formatWithCommas(ratio * BASE_VALUES.potassium);
    if (sourceId !== 'sodium') inputNa.value = formatWithCommas(ratio * BASE_VALUES.sodium);
    if (sourceId !== 'total') inputTotal.value = formatWithCommas(ratio * BASE_VALUES.total);
}

function handleInput(e) {
    const input = e.target;
    calculateFrom(input.id, input.value);
}

function handlePrint() {
    // Set current date and time for the print
    const timestamp = document.getElementById('print-timestamp');
    const now = new Date();
    timestamp.textContent = `Printed on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
    
    window.print();
}

function resetValues() {
    inputMg.value = formatWithCommas(BASE_VALUES.magnesium);
    inputK.value = formatWithCommas(BASE_VALUES.potassium);
    inputNa.value = formatWithCommas(BASE_VALUES.sodium);
    inputTotal.value = formatWithCommas(BASE_VALUES.total);
}

// Attach event listeners
[inputMg, inputK, inputNa, inputTotal].forEach(input => {
    input.addEventListener('input', (e) => {
        // Allow only numbers, commas, and one decimal point
        let val = e.target.value.replace(/[^0-9.,]/g, '');
        
        // Prevent multiple decimal points
        const points = val.split('.');
        if (points.length > 2) val = points[0] + '.' + points.slice(1).join('');
        
        e.target.value = val;
        handleInput(e);
    });
    
    input.addEventListener('blur', (e) => {
        const num = parseCommas(e.target.value);
        if (!isNaN(num)) {
            e.target.value = formatWithCommas(num);
        }
    });
});

resetBtn.addEventListener('click', () => {
    resetValues();
    // Add a tiny snappy animation effect to the button when clicked
    resetBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        resetBtn.style.transform = '';
    }, 150);
});

printBtn.addEventListener('click', handlePrint);

// Initialize inputs with the base starting values
resetValues();
