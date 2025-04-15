/**
 * Renders an NPC in the display area
 * @param {Object} npc - The NPC object to render
 */
export function renderNPC(npc) {
    if (!npc) {
        return;
    }
    
    const displayArea = document.getElementById('npc-display');
    
    // Create HTML for NPC display
    let html = `
        <div class="npc-info">
            <h3 class="npc-name">${npc.name}</h3>
            <p class="npc-race-class">${npc.race?.name || 'Unknown Race'} ${npc.class?.name || 'Unknown Class'}</p>
            <p>Age: ${npc.age}, Gender: ${capitalizeFirstLetter(npc.gender)}</p>
        </div>
    `;
    
    // Add personality traits
    if (npc.traits && npc.traits.length > 0) {
        html += `
            <div class="npc-section">
                <h3>Personality Traits</h3>
                <ul>
                    ${npc.traits.map(trait => `<li>${trait.description}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Add quirks
    if (npc.quirks && npc.quirks.length > 0) {
        html += `
            <div class="npc-section">
                <h3>Quirks</h3>
                <ul>
                    ${npc.quirks.map(quirk => `<li>${quirk.description}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Add flaws
    if (npc.flaws && npc.flaws.length > 0) {
        html += `
            <div class="npc-section">
                <h3>Flaws</h3>
                <ul>
                    ${npc.flaws.map(flaw => `<li>${flaw.description}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Set the HTML content
    displayArea.innerHTML = html;
}

/**
 * Capitalize the first letter of a string
 * @param {string} string - The string to capitalize
 * @returns {string} - The capitalized string
 */
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}