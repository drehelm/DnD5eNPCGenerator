/**
 * Coherence rules to ensure NPCs have consistent attributes
 */

/**
 * Check if an age is valid for a race
 * @param {number} age - Age to check
 * @param {Object} race - Race object with age properties
 * @returns {boolean} - Whether the age is valid
 */
const isValidAgeForRace = (age, race) => {
  if (!race || !race.ageRanges) {
    return true;
  }
  
  return age >= race.ageRanges.min && age <= race.ageRanges.max;
};

/**
 * Get an appropriate age range for a race
 * @param {Object} race - Race object with age properties
 * @returns {Object} - Min and max ages for the race
 */
const getAgeRangeForRace = (race) => {
  if (!race || !race.ageRanges) {
    return { min: 18, max: 80 }; // Default human-like range
  }
  
  return {
    min: race.ageRanges.min,
    max: race.ageRanges.max
  };
};

/**
 * Determine age category (child, young, adult, middle-aged, old, venerable)
 * @param {number} age - Age to categorize
 * @param {Object} race - Race object with age properties
 * @returns {string} - Age category
 */
const getAgeCategory = (age, race) => {
  if (!race || !race.ageRanges) {
    // Default human-like categories
    if (age < 13) return 'child';
    if (age < 20) return 'young';
    if (age < 40) return 'adult';
    if (age < 60) return 'middle-aged';
    if (age < 80) return 'old';
    return 'venerable';
  }
  
  const { min, max } = race.ageRanges;
  const lifespan = max - min;
  
  // Calculate life stage based on percentage through lifespan
  const percentage = (age - min) / lifespan;
  
  if (percentage < 0.15) return 'child';
  if (percentage < 0.25) return 'young';
  if (percentage < 0.6) return 'adult';
  if (percentage < 0.8) return 'middle-aged';
  if (percentage < 0.95) return 'old';
  return 'venerable';
};

/**
 * Filter traits by compatibility with race, class, and age
 * @param {Array} traits - Array of trait objects
 * @param {Object} race - Race object
 * @param {Object} characterClass - Class object
 * @param {number} age - Character age
 * @returns {Array} - Filtered traits
 */
const filterTraitsByCompatibility = (traits, race, characterClass, age) => {
  if (!traits || traits.length === 0) {
    return [];
  }
  
  const ageCategory = getAgeCategory(age, race);
  
  return traits.filter(trait => {
    // Check race compatibility
    if (trait.raceTags && trait.raceTags.length > 0) {
      if (!race || !trait.raceTags.includes(race.id)) {
        return false;
      }
    }
    
    // Check class compatibility
    if (trait.classTags && trait.classTags.length > 0) {
      if (!characterClass || !trait.classTags.includes(characterClass.id)) {
        return false;
      }
    }
    
    // Check age compatibility
    if (trait.ageTags && trait.ageTags.length > 0) {
      if (!trait.ageTags.includes(ageCategory)) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * Check if a family structure is valid for a character
 * @param {Object} character - Character object
 * @param {Object} familyTemplate - Family template
 * @returns {boolean} - Whether the family structure is valid
 */
const isValidFamilyStructure = (character, familyTemplate) => {
  // Character must have age and race
  if (!character || !character.age || !character.race) {
    return false;
  }
  
  // Check if family template is appropriate for age
  const ageCategory = getAgeCategory(character.age, character.race);
  
  // Children shouldn't have spouses or children of their own
  if (ageCategory === 'child' && 
     (familyTemplate.hasSpouse || familyTemplate.hasChildren)) {
    return false;
  }
  
  // Young characters are less likely to have children
  if (ageCategory === 'young' && familyTemplate.hasChildren) {
    return character.age >= 16; // Minimum age to have children
  }
  
  // Older characters are more likely to have extended family
  if (ageCategory === 'venerable' && !familyTemplate.hasExtendedFamily) {
    return false;
  }
  
  return true;
};

/**
 * Ensure coherent trait combinations
 * @param {Array} selectedTraits - Array of selected trait objects
 * @returns {Array} - Filtered traits with incompatibilities removed
 */
const ensureCoherentTraits = (selectedTraits) => {
  if (!selectedTraits || selectedTraits.length === 0) {
    return [];
  }
  
  const result = [...selectedTraits];
  
  // Remove conflicting traits
  for (let i = 0; i < result.length; i++) {
    const trait = result[i];
    
    if (trait.conflictsWith && trait.conflictsWith.length > 0) {
      // Check for conflicts with other selected traits
      for (let j = i + 1; j < result.length; j++) {
        if (trait.conflictsWith.includes(result[j].id)) {
          // Remove the conflicting trait
          result.splice(j, 1);
          j--;
        }
      }
    }
  }
  
  return result;
};

module.exports = {
  isValidAgeForRace,
  getAgeRangeForRace,
  getAgeCategory,
  filterTraitsByCompatibility,
  isValidFamilyStructure,
  ensureCoherentTraits
};