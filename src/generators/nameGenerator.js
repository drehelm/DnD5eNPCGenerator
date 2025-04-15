const dataLoader = require('../utils/dataLoader');
const randomizer = require('../utils/randomizer');

/**
 * Generate a random name based on race and gender
 * @param {Object} race - Race object
 * @param {string} gender - Gender ('male', 'female', 'nonbinary')
 * @returns {Promise<string>} - Generated name
 */
const generateName = async (race, gender) => {
  try {
    const namesData = await dataLoader.loadNames();
    
    // Default to human names if race is not found
    const raceName = race?.id || 'human';
    
    // Find race-specific names
    let nameList = namesData[raceName];
    
    // If race not found in names data, use human names
    if (!nameList) {
      nameList = namesData.human;
    }
    
    // Handle different genders
    let firstNames;
    if (gender === 'male' && nameList.male) {
      firstNames = nameList.male;
    } else if (gender === 'female' && nameList.female) {
      firstNames = nameList.female;
    } else if (nameList.nonbinary) {
      firstNames = nameList.nonbinary;
    } else {
      // If gender-specific names not found, use combined list or any available
      firstNames = nameList.all || nameList.male || nameList.female || [];
    }
    
    // Get surnames if they exist for this race
    const surnames = nameList.surnames || [];
    
    // Generate first name
    const firstName = randomizer.getRandomItem(firstNames) || 'Unknown';
    
    // Generate surname if available for this race
    let fullName = firstName;
    if (surnames.length > 0 && randomizer.getRandomBoolean(0.8)) {
      const surname = randomizer.getRandomItem(surnames);
      fullName = `${firstName} ${surname}`;
    }
    
    // Some races might have title or honorific
    if (nameList.titles && randomizer.getRandomBoolean(0.1)) {
      const title = randomizer.getRandomItem(nameList.titles);
      fullName = `${title} ${fullName}`;
    }
    
    return fullName;
  } catch (error) {
    console.error('Error generating name:', error);
    return 'Unknown';
  }
};

/**
 * Generate a family name for family members
 * @param {Object} race - Race object
 * @returns {Promise<string>} - Family surname
 */
const generateFamilyName = async (race) => {
  try {
    const namesData = await dataLoader.loadNames();
    
    // Default to human names if race is not found
    const raceName = race?.id || 'human';
    
    // Find race-specific names
    let nameList = namesData[raceName];
    
    // If race not found in names data, use human names
    if (!nameList) {
      nameList = namesData.human;
    }
    
    // Get surnames if they exist for this race
    const surnames = nameList.surnames || [];
    
    if (surnames.length > 0) {
      return randomizer.getRandomItem(surnames);
    }
    
    return '';
  } catch (error) {
    console.error('Error generating family name:', error);
    return '';
  }
};

module.exports = {
  generateName,
  generateFamilyName
};