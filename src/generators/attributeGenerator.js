const dataLoader = require('../utils/dataLoader');
const randomizer = require('../utils/randomizer');
const coherenceRules = require('../utils/coherenceRules');

/**
 * Generate random quirks for an NPC
 * @param {Object} character - Character data including race, class, age
 * @param {number} count - Number of quirks to generate
 * @returns {Promise<Array>} - Array of quirk objects
 */
const generateQuirks = async (character, count = 2) => {
  try {
    const allQuirks = await dataLoader.loadQuirks();
    
    // Filter quirks by compatibility with race, class, and age
    const compatibleQuirks = coherenceRules.filterTraitsByCompatibility(
      allQuirks,
      character.race,
      character.class,
      character.age
    );
    
    // Select random quirks
    return randomizer.getMultipleRandomItems(compatibleQuirks, count);
  } catch (error) {
    console.error('Error generating quirks:', error);
    return [];
  }
};

/**
 * Generate random personality traits for an NPC
 * @param {Object} character - Character data including race, class, age
 * @param {number} count - Number of traits to generate
 * @returns {Promise<Array>} - Array of trait objects
 */
const generateTraits = async (character, count = 3) => {
  try {
    const allTraits = await dataLoader.loadTraits();
    
    // Filter traits by compatibility with race, class, and age
    const compatibleTraits = coherenceRules.filterTraitsByCompatibility(
      allTraits,
      character.race,
      character.class,
      character.age
    );
    
    // Select random traits
    const selectedTraits = randomizer.getMultipleRandomItems(compatibleTraits, count);
    
    // Ensure traits are coherent with each other
    return coherenceRules.ensureCoherentTraits(selectedTraits);
  } catch (error) {
    console.error('Error generating traits:', error);
    return [];
  }
};

/**
 * Generate random flaws for an NPC
 * @param {Object} character - Character data including race, class, age
 * @param {number} count - Number of flaws to generate
 * @returns {Promise<Array>} - Array of flaw objects
 */
const generateFlaws = async (character, count = 1) => {
  try {
    const allFlaws = await dataLoader.loadFlaws();
    
    // Filter flaws by compatibility with race, class, and age
    const compatibleFlaws = coherenceRules.filterTraitsByCompatibility(
      allFlaws,
      character.race,
      character.class,
      character.age
    );
    
    // Select random flaws
    return randomizer.getMultipleRandomItems(compatibleFlaws, count);
  } catch (error) {
    console.error('Error generating flaws:', error);
    return [];
  }
};

/**
 * Generate a random age for a character based on race
 * @param {Object} race - Race object with age ranges
 * @returns {number} - Generated age
 */
const generateAge = (race) => {
  const ageRange = coherenceRules.getAgeRangeForRace(race);
  
  // Weighted distribution to favor middle ages
  const min = ageRange.min;
  const max = ageRange.max;
  const range = max - min;
  
  // Generate three random numbers and take the average
  // This creates a bell curve distribution
  const age1 = randomizer.getRandomInt(min, max);
  const age2 = randomizer.getRandomInt(min, max);
  const age3 = randomizer.getRandomInt(min, max);
  
  const age = Math.floor((age1 + age2 + age3) / 3);
  
  return age;
};

/**
 * Generate random gender
 * @returns {string} - Gender ('male', 'female', 'nonbinary')
 */
const generateGender = () => {
  const genders = ['male', 'female', 'nonbinary'];
  const weights = [0.48, 0.48, 0.04]; // Adjust probabilities as needed
  
  let random = Math.random();
  let sum = 0;
  
  for (let i = 0; i < genders.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return genders[i];
    }
  }
  
  return 'nonbinary';
};

module.exports = {
  generateQuirks,
  generateTraits,
  generateFlaws,
  generateAge,
  generateGender
};