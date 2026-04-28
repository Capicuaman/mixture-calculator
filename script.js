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

const invMg = document.getElementById('inv-magnesium');
const invK = document.getElementById('inv-potassium');
const invNa = document.getElementById('inv-sodium');

const resetBtn = document.getElementById('reset-btn');
const printBtn = document.getElementById('print-btn');

// Inventory Persistence
function loadInventory() {
    const saved = localStorage.getItem('mixture_inventory');
    if (saved) {
        const data = JSON.parse(saved);
        invMg.value = data.magnesium || 0;
        invK.value = data.potassium || 0;
        invNa.value = data.sodium || 0;
    } else {
        invMg.value = 0;
        invK.value = 0;
        invNa.value = 0;
    }
}

function saveInventory() {
    const data = {
        magnesium: parseFloat(invMg.value) || 0,
        potassium: parseFloat(invK.value) || 0,
        sodium: parseFloat(invNa.value) || 0
    };
    localStorage.setItem('mixture_inventory', JSON.stringify(data));
}

function formatValue(val) {
    if (isNaN(val) || !isFinite(val)) return '';
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
    
    if (numValue < 0) {
        numValue = 0;
        document.getElementById(sourceId).value = 0;
    }

    const sourceBase = BASE_VALUES[sourceId];
    const ratio = numValue / sourceBase;

    if (sourceId !== 'magnesium') inputMg.value = formatValue(ratio * BASE_VALUES.magnesium);
    if (sourceId !== 'potassium') inputK.value = formatValue(ratio * BASE_VALUES.potassium);
    if (sourceId !== 'sodium') inputNa.value = formatValue(ratio * BASE_VALUES.sodium);
    if (sourceId !== 'total') inputTotal.value = formatValue(ratio * BASE_VALUES.total);
}

function handleInput(e) {
    calculateFrom(e.target.id, e.target.value);
}

function resetValues() {
    inputMg.value = BASE_VALUES.magnesium;
    inputK.value = BASE_VALUES.potassium;
    inputNa.value = BASE_VALUES.sodium;
    inputTotal.value = BASE_VALUES.total;
}

function handlePrint() {
    const currentMg = parseFloat(inputMg.value) || 0;
    const currentK = parseFloat(inputK.value) || 0;
    const currentNa = parseFloat(inputNa.value) || 0;

    const stockMg = parseFloat(invMg.value) || 0;
    const stockK = parseFloat(invK.value) || 0;
    const stockNa = parseFloat(invNa.value) || 0;

    if (currentMg > stockMg || currentK > stockK || currentNa > stockNa) {
        if (!confirm('Warning: One or more ingredients exceed current stock. Proceed anyway?')) {
            return;
        }
    } else {
        if (!confirm(`Are you sure you want to print and subtract these amounts from inventory?\n\nMg: ${currentMg}g\nK: ${currentK}g\nNa: ${currentNa}g`)) {
            return;
        }
    }

    // Update stock
    invMg.value = formatValue(Math.max(0, stockMg - currentMg));
    invK.value = formatValue(Math.max(0, stockK - currentK));
    invNa.value = formatValue(Math.max(0, stockNa - currentNa));

    saveInventory();
    
    // Set current date and time for the print
    const timestamp = document.getElementById('print-timestamp');
    const now = new Date();
    timestamp.textContent = `Printed on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
    
    window.print();
}

// Event Listeners
[inputMg, inputK, inputNa, inputTotal].forEach(input => {
    input.addEventListener('input', handleInput);
});

[invMg, invK, invNa].forEach(input => {
    input.addEventListener('input', saveInventory);
});

resetBtn.addEventListener('click', () => {
    resetValues();
    resetBtn.style.transform = 'scale(0.95)';
    setTimeout(() => resetBtn.style.transform = '', 150);
});

printBtn.addEventListener('click', handlePrint);

// Init
loadInventory();
resetValues();
