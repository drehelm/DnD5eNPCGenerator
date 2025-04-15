/**
 * Renders a family tree in the display area
 * @param {Object} familyTree - The family tree object to render
 */
export function renderFamilyTree(familyTree) {
    if (!familyTree) {
        return;
    }
    
    const familyTreeContainer = document.getElementById('family-tree-container');
    
    // Create HTML for family tree display
    let html = `<h3 class="family-tree-title">Family Tree</h3>`;
    
    // Add parents
    if (familyTree.parents && familyTree.parents.length > 0) {
        html += `
            <div class="family-group">
                <h3>Parents</h3>
                ${familyTree.parents.map(parent => renderFamilyMember(parent)).join('')}
            </div>
        `;
    }
    
    // Add siblings
    if (familyTree.siblings && familyTree.siblings.length > 0) {
        html += `
            <div class="family-group">
                <h3>Siblings</h3>
                ${familyTree.siblings.map(sibling => renderFamilyMember(sibling)).join('')}
            </div>
        `;
    }
    
    // Add spouse
    if (familyTree.spouse) {
        html += `
            <div class="family-group">
                <h3>Spouse</h3>
                ${renderFamilyMember(familyTree.spouse)}
            </div>
        `;
    }
    
    // Add children
    if (familyTree.children && familyTree.children.length > 0) {
        html += `
            <div class="family-group">
                <h3>Children</h3>
                ${familyTree.children.map(child => renderFamilyMember(child)).join('')}
            </div>
        `;
    }
    
    // Add extended family
    if (familyTree.extendedFamily && familyTree.extendedFamily.length > 0) {
        html += `
            <div class="family-group">
                <h3>Extended Family</h3>
                ${familyTree.extendedFamily.map(relative => renderFamilyMember(relative)).join('')}
            </div>
        `;
    }
    
    // Set the HTML content
    familyTreeContainer.innerHTML = html;
}

/**
 * Renders a single family member
 * @param {Object} member - The family member to render
 * @returns {string} - HTML for the family member
 */
function renderFamilyMember(member) {
    if (!member) {
        return '';
    }
    
    const statusClass = member.isAlive ? 'alive' : 'dead';
    
    return `
        <div class="family-member ${statusClass}">
            <h4>${member.name}</h4>
            <p class="family-relation">${formatRelation(member.relation)}</p>
            <p class="family-details">
                ${member.race?.name || ''} 
                ${member.gender ? capitalizeFirstLetter(member.gender) : ''}
                ${member.age ? `, ${member.age} years old` : ''}
                ${!member.isAlive ? ' (Deceased)' : ''}
            </p>
        </div>
    `;
}

/**
 * Formats a relation string for display
 * @param {string} relation - The relation string
 * @returns {string} - Formatted relation string
 */
function formatRelation(relation) {
    if (!relation) return '';
    
    // Capitalize first letter
    relation = capitalizeFirstLetter(relation);
    
    return relation;
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