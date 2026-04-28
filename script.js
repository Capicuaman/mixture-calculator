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

function formatValue(val) {
    if (isNaN(val) || !isFinite(val)) return '';
    // Ensure accurate rounding to max 2 decimal places to avoid floating point inconsistencies, 
    // but without leaving unnecessary trailing zeros
    return parseFloat(val.toFixed(2));
}

function calculateFrom(sourceId, value) {
    if (value === '' || isNaN(value)) {
        [inputMg, inputK, inputNa, inputTotal].forEach(input => {
            if (input.id !== sourceId) input.value = '';
        });
        return;
    }

    let numValue = parseFloat(value);
    
    // Prevent negative numbers
    if (numValue < 0) {
        numValue = 0;
        document.getElementById(sourceId).value = 0;
    }

    const sourceBase = BASE_VALUES[sourceId];
    
    // Calculate ratio relative to base
    const ratio = numValue / sourceBase;

    // Update other inputs
    if (sourceId !== 'magnesium') {
        inputMg.value = formatValue(ratio * BASE_VALUES.magnesium);
    }
    if (sourceId !== 'potassium') {
        inputK.value = formatValue(ratio * BASE_VALUES.potassium);
    }
    if (sourceId !== 'sodium') {
        inputNa.value = formatValue(ratio * BASE_VALUES.sodium);
    }
    if (sourceId !== 'total') {
        inputTotal.value = formatValue(ratio * BASE_VALUES.total);
    }
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
    inputMg.value = BASE_VALUES.magnesium;
    inputK.value = BASE_VALUES.potassium;
    inputNa.value = BASE_VALUES.sodium;
    inputTotal.value = BASE_VALUES.total;
}

// Attach event listeners
inputMg.addEventListener('input', handleInput);
inputK.addEventListener('input', handleInput);
inputNa.addEventListener('input', handleInput);
inputTotal.addEventListener('input', handleInput);

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
