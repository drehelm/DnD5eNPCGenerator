const dataLoader = require('../utils/dataLoader');
const randomizer = require('../utils/randomizer');
const nameGenerator = require('./nameGenerator');
const attributeGenerator = require('./attributeGenerator');
const familyGenerator = require('./familyGenerator');

/**
 * Generate a complete NPC based on provided parameters
 * @param {Object} parameters - Generation parameters
 * @returns {Promise<Object>} - Complete NPC object
 */
const generateNPC = async (parameters = {}) => {
  try {
    // Initialize NPC object
    const npc = {
      race: null,
      class: null,
      age: 0,
      gender: '',
      name: '',
      quirks: [],
      traits: [],
      flaws: [],
      familyTree: null
    };
    
    // Load race and class data
    const races = await dataLoader.loadRaces();
    const classes = await dataLoader.loadClasses();
    
    // Determine race
    if (parameters.race) {
      npc.race = races.find(r => r.id === parameters.race) || null;
    } else {
      npc.race = randomizer.getRandomItem(races);
    }
    
    // Determine class
    if (parameters.class) {
      npc.class = classes.find(c => c.id === parameters.class) || null;
    } else {
      npc.class = randomizer.getRandomItem(classes);
    }
    
    // Determine gender
    if (parameters.gender) {
      npc.gender = parameters.gender;
    } else {
      npc.gender = attributeGenerator.generateGender();
    }
    
    // Determine age
    if (parameters.age) {
      npc.age = parameters.age;
    } else {
      npc.age = attributeGenerator.generateAge(npc.race);
    }
    
    // Generate name
    npc.name = await nameGenerator.generateName(npc.race, npc.gender);
    
    // Generate quirks, traits, and flaws
    npc.quirks = await attributeGenerator.generateQuirks(
      npc, 
      parameters.quirkCount || 2
    );
    
    npc.traits = await attributeGenerator.generateTraits(
      npc, 
      parameters.traitCount || 3
    );
    
    npc.flaws = await attributeGenerator.generateFlaws(
      npc, 
      parameters.flawCount || 1
    );
    
    // Generate family tree if requested
    if (parameters.generateFamily) {
      npc.familyTree = await familyGenerator.generateFamilyTree(
        npc, 
        parameters.familyDepth || 1
      );
    }
    
    return npc;
  } catch (error) {
    console.error('Error generating NPC:', error);
    throw error;
  }
};

/**
 * Regenerate specific attributes of an existing NPC
 * @param {Object} npc - Existing NPC object
 * @param {Array} attributesToRegenerate - Array of attribute names to regenerate
 * @returns {Promise<Object>} - Updated NPC object
 */
const regenerateAttributes = async (npc, attributesToRegenerate = []) => {
  try {
    const updatedNPC = { ...npc };
    
    // Process each attribute to regenerate
    for (const attribute of attributesToRegenerate) {
      switch (attribute) {
        case 'name':
          updatedNPC.name = await nameGenerator.generateName(npc.race, npc.gender);
          break;
          
        case 'race':
          const races = await dataLoader.loadRaces();
          updatedNPC.race = randomizer.getRandomItem(races);
          // Age might need adjustment for new race
          updatedNPC.age = attributeGenerator.generateAge(updatedNPC.race);
          break;
          
        case 'class':
          const classes = await dataLoader.loadClasses();
          updatedNPC.class = randomizer.getRandomItem(classes);
          break;
          
        case 'age':
          updatedNPC.age = attributeGenerator.generateAge(npc.race);
          break;
          
        case 'gender':
          updatedNPC.gender = attributeGenerator.generateGender();
          break;
          
        case 'quirks':
          updatedNPC.quirks = await attributeGenerator.generateQuirks(npc, npc.quirks.length);
          break;
          
        case 'traits':
          updatedNPC.traits = await attributeGenerator.generateTraits(npc, npc.traits.length);
          break;
          
        case 'flaws':
          updatedNPC.flaws = await attributeGenerator.generateFlaws(npc, npc.flaws.length);
          break;
          
        case 'familyTree':
          updatedNPC.familyTree = await familyGenerator.generateFamilyTree(npc, 1);
          break;
          
        default:
          // Ignore unknown attributes
          break;
      }
    }
    
    return updatedNPC;
  } catch (error) {
    console.error('Error regenerating attributes:', error);
    throw error;
  }
};

module.exports = {
  generateNPC,
  regenerateAttributes
};