/**
 * Sets up the NPC generation form
 */
export function setupForm() {
    // Handle family checkbox
    setupFamilyOptions();
    
    // Add reset button functionality
    setupResetButton();
    
    // Add validation
    setupFormValidation();
}

/**
 * Sets up the family options interactions
 */
function setupFamilyOptions() {
    const generateFamilyCheckbox = document.getElementById('generate-family');
    const familyDepthSelect = document.getElementById('family-depth');
    
    // Initial state
    familyDepthSelect.disabled = !generateFamilyCheckbox.checked;
    
    // Handle changes
    generateFamilyCheckbox.addEventListener('change', () => {
        familyDepthSelect.disabled = !generateFamilyCheckbox.checked;
    });
}

/**
 * Sets up the reset button functionality
 */
function setupResetButton() {
    // Add a reset button to the form if it doesn't exist
    const form = document.getElementById('npc-form');
    let resetButton = document.querySelector('#npc-form button[type="reset"]');
    
    if (!resetButton) {
        resetButton = document.createElement('button');
        resetButton.type = 'reset';
        resetButton.textContent = 'Reset Form';
        resetButton.className = 'reset-button';
        
        // Add it before the generate button
        const generateButton = document.getElementById('generate-button');
        form.insertBefore(resetButton, generateButton);
    }
    
    // Handle reset
    form.addEventListener('reset', (e) => {
        // Wait for form to reset
        setTimeout(() => {
            // Make sure family depth is disabled if checkbox is unchecked
            const generateFamilyCheckbox = document.getElementById('generate-family');
            const familyDepthSelect = document.getElementById('family-depth');
            familyDepthSelect.disabled = !generateFamilyCheckbox.checked;
        }, 0);
    });
}

/**
 * Sets up form validation
 */
function setupFormValidation() {
    const form = document.getElementById('npc-form');
    
    form.addEventListener('submit', (e) => {
        // Validate number inputs
        const ageInput = document.getElementById('age');
        if (ageInput.value && (isNaN(ageInput.value) || ageInput.value < 1)) {
            e.preventDefault();
            alert('Age must be a positive number');
            return;
        }
        
        const traitCountInput = document.getElementById('trait-count');
        if (isNaN(traitCountInput.value) || traitCountInput.value < 1 || traitCountInput.value > 5) {
            e.preventDefault();
            alert('Trait count must be between 1 and 5');
            return;
        }
        
        const quirkCountInput = document.getElementById('quirk-count');
        if (isNaN(quirkCountInput.value) || quirkCountInput.value < 1 || quirkCountInput.value > 5) {
            e.preventDefault();
            alert('Quirk count must be between 1 and 5');
            return;
        }
        
        const flawCountInput = document.getElementById('flaw-count');
        if (isNaN(flawCountInput.value) || flawCountInput.value < 1 || flawCountInput.value > 3) {
            e.preventDefault();
            alert('Flaw count must be between 1 and 3');
            return;
        }
    });
}