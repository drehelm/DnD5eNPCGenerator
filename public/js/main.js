// Import modules
import { renderNPC } from './npcDisplay.js';
import { renderFamilyTree } from './familyTreeVisualizer.js';
import { setupForm } from './formHandler.js';

// Store the current NPC
let currentNPC = null;

// DOM elements
const npcForm = document.getElementById('npc-form');
const regenerateButton = document.getElementById('regenerate-button');
const copyButton = document.getElementById('copy-button');
const regenerateModal = document.getElementById('regenerate-modal');
const confirmRegenerateButton = document.getElementById('confirm-regenerate');
const cancelRegenerateButton = document.getElementById('cancel-regenerate');

// Initialize
async function init() {
    // Fetch races and classes from API to populate dropdowns
    await loadRacesAndClasses();
    
    // Set up form submission
    setupFormHandling();
    
    // Set up regeneration handling
    setupRegenerationHandling();
    
    // Set up copy button
    setupCopyButton();
}

// Load races and classes from API
async function loadRacesAndClasses() {
    try {
        // Load races
        const racesResponse = await fetch('/api/races');
        const races = await racesResponse.json();
        populateDropdown('race', races);
        
        // Load classes
        const classesResponse = await fetch('/api/classes');
        const classes = await classesResponse.json();
        populateDropdown('class', classes);
    } catch (error) {
        console.error('Error loading races and classes:', error);
        showError('Failed to load data. Please try again later.');
    }
}

// Populate a dropdown with options
function populateDropdown(id, items) {
    const dropdown = document.getElementById(id);
    
    // Clear existing options except the first one
    while (dropdown.options.length > 1) {
        dropdown.remove(1);
    }
    
    // Add new options
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        dropdown.appendChild(option);
    });
}

// Set up form submission
function setupFormHandling() {
    npcForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(npcForm);
        const parameters = {};
        
        // Convert form data to parameters object
        formData.forEach((value, key) => {
            // Handle checkbox
            if (key === 'generateFamily') {
                parameters[key] = value === 'on';
            } 
            // Handle empty values
            else if (value === '') {
                // Don't include empty values
            }
            // Handle numbers
            else if (['age', 'traitCount', 'quirkCount', 'flawCount', 'familyDepth'].includes(key)) {
                parameters[key] = parseInt(value);
            }
            // Everything else as string
            else {
                parameters[key] = value;
            }
        });
        
        try {
            // Show loading state
            document.getElementById('npc-display').innerHTML = '<p class="loading">Generating NPC...</p>';
            
            // Call API to generate NPC
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parameters)
            });
            
            if (!response.ok) {
                throw new Error('Failed to generate NPC');
            }
            
            // Get NPC data
            currentNPC = await response.json();
            
            // Render NPC
            renderNPC(currentNPC);
            
            // Render family tree if it exists
            if (currentNPC.familyTree) {
                renderFamilyTree(currentNPC.familyTree);
            }
            
            // Enable buttons
            regenerateButton.disabled = false;
            copyButton.disabled = false;
        } catch (error) {
            console.error('Error generating NPC:', error);
            document.getElementById('npc-display').innerHTML = '<p class="error">Error generating NPC. Please try again.</p>';
        }
    });
    
    // Handle family checkbox
    const generateFamilyCheckbox = document.getElementById('generate-family');
    const familyDepthSelect = document.getElementById('family-depth');
    
    generateFamilyCheckbox.addEventListener('change', () => {
        familyDepthSelect.disabled = !generateFamilyCheckbox.checked;
    });
}

// Set up regeneration handling
function setupRegenerationHandling() {
    // Open modal when regenerate button is clicked
    regenerateButton.addEventListener('click', () => {
        regenerateModal.classList.add('show');
    });
    
    // Close modal when cancel is clicked
    cancelRegenerateButton.addEventListener('click', () => {
        regenerateModal.classList.remove('show');
    });
    
    // Handle confirm regeneration
    confirmRegenerateButton.addEventListener('click', async () => {
        // Get selected attributes to regenerate
        const attributesToRegenerate = Array.from(
            document.querySelectorAll('input[name="regenerate"]:checked')
        ).map(input => input.value);
        
        if (attributesToRegenerate.length === 0) {
            alert('Please select at least one attribute to regenerate.');
            return;
        }
        
        try {
            // Show loading state
            document.getElementById('npc-display').innerHTML = '<p class="loading">Regenerating NPC...</p>';
            
            // Close modal
            regenerateModal.classList.remove('show');
            
            // Call API to regenerate attributes
            const response = await fetch('/api/regenerate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    npc: currentNPC,
                    attributesToRegenerate
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to regenerate attributes');
            }
            
            // Get updated NPC data
            currentNPC = await response.json();
            
            // Render updated NPC
            renderNPC(currentNPC);
            
            // Render family tree if it exists
            if (currentNPC.familyTree) {
                renderFamilyTree(currentNPC.familyTree);
            }
        } catch (error) {
            console.error('Error regenerating attributes:', error);
            document.getElementById('npc-display').innerHTML = '<p class="error">Error regenerating NPC. Please try again.</p>';
        }
    });
}

// Set up copy button
function setupCopyButton() {
    copyButton.addEventListener('click', () => {
        if (!currentNPC) return;
        
        try {
            // Create a formatted text representation of the NPC
            const npcText = formatNPCForCopy(currentNPC);
            
            // Copy to clipboard
            navigator.clipboard.writeText(npcText)
                .then(() => {
                    // Show success message
                    const originalText = copyButton.textContent;
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = originalText;
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy NPC:', err);
                    alert('Failed to copy NPC to clipboard.');
                });
        } catch (error) {
            console.error('Error copying NPC:', error);
            alert('Failed to copy NPC to clipboard.');
        }
    });
}

// Format NPC for copying to clipboard
function formatNPCForCopy(npc) {
    let text = `${npc.name} - ${npc.race?.name || 'Unknown Race'} ${npc.class?.name || 'Unknown Class'}\n`;
    text += `Age: ${npc.age}, Gender: ${npc.gender}\n\n`;
    
    // Add traits
    if (npc.traits && npc.traits.length > 0) {
        text += 'Personality Traits:\n';
        npc.traits.forEach(trait => {
            text += `- ${trait.description}\n`;
        });
        text += '\n';
    }
    
    // Add quirks
    if (npc.quirks && npc.quirks.length > 0) {
        text += 'Quirks:\n';
        npc.quirks.forEach(quirk => {
            text += `- ${quirk.description}\n`;
        });
        text += '\n';
    }
    
    // Add flaws
    if (npc.flaws && npc.flaws.length > 0) {
        text += 'Flaws:\n';
        npc.flaws.forEach(flaw => {
            text += `- ${flaw.description}\n`;
        });
        text += '\n';
    }
    
    // Add family information if available
    if (npc.familyTree) {
        text += 'Family:\n';
        
        // Add parents
        if (npc.familyTree.parents && npc.familyTree.parents.length > 0) {
            text += 'Parents:\n';
            npc.familyTree.parents.forEach(parent => {
                text += `- ${parent.name} (${parent.relation}, ${parent.age} years old, ${parent.isAlive ? 'Alive' : 'Deceased'})\n`;
            });
            text += '\n';
        }
        
        // Add siblings
        if (npc.familyTree.siblings && npc.familyTree.siblings.length > 0) {
            text += 'Siblings:\n';
            npc.familyTree.siblings.forEach(sibling => {
                text += `- ${sibling.name} (${sibling.relation}, ${sibling.age} years old, ${sibling.isAlive ? 'Alive' : 'Deceased'})\n`;
            });
            text += '\n';
        }
        
        // Add spouse
        if (npc.familyTree.spouse) {
            text += 'Spouse:\n';
            const spouse = npc.familyTree.spouse;
            text += `- ${spouse.name} (${spouse.age} years old, ${spouse.isAlive ? 'Alive' : 'Deceased'})\n\n`;
        }
        
        // Add children
        if (npc.familyTree.children && npc.familyTree.children.length > 0) {
            text += 'Children:\n';
            npc.familyTree.children.forEach(child => {
                text += `- ${child.name} (${child.age} years old, ${child.isAlive ? 'Alive' : 'Deceased'})\n`;
            });
            text += '\n';
        }
        
        // Add extended family
        if (npc.familyTree.extendedFamily && npc.familyTree.extendedFamily.length > 0) {
            text += 'Extended Family:\n';
            npc.familyTree.extendedFamily.forEach(relative => {
                text += `- ${relative.name} (${relative.relation}, ${relative.age} years old, ${relative.isAlive ? 'Alive' : 'Deceased'})\n`;
            });
        }
    }
    
    return text;
}

// Show error message
function showError(message) {
    alert(message);
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Export for use in other modules
export { currentNPC };