const dataLoader = require('../utils/dataLoader');
const randomizer = require('../utils/randomizer');
const coherenceRules = require('../utils/coherenceRules');
const nameGenerator = require('./nameGenerator');
const attributeGenerator = require('./attributeGenerator');

/**
 * Generate a family tree for an NPC
 * @param {Object} character - Character data
 * @param {number} depth - Tree depth (1-3, where 1 is immediate family only)
 * @returns {Promise<Object>} - Family tree object
 */
const generateFamilyTree = async (character, depth = 1) => {
  try {
    // Load family templates
    const familyTemplates = await dataLoader.loadFamilyTemplates();
    
    // Select appropriate family template
    const validTemplates = familyTemplates.filter(template => 
      coherenceRules.isValidFamilyStructure(character, template)
    );
    
    const template = randomizer.getRandomItem(validTemplates) || {
      hasParents: true,
      hasSiblings: true,
      hasSpouse: false,
      hasChildren: false,
      hasExtendedFamily: false
    };
    
    // Build family tree - don't store full character reference to avoid circular reference
    const familyTree = {
      // Store only essential character info, not the entire object
      characterInfo: {
        name: character.name,
        race: character.race?.id || null,
        age: character.age,
        gender: character.gender
      },
      parents: [],
      siblings: [],
      spouse: null,
      children: [],
      extendedFamily: []
    };
    
    // Get family surname if applicable
    let familySurname = '';
    if (character.name && character.name.includes(' ')) {
      familySurname = character.name.split(' ').pop();
    } else {
      familySurname = await nameGenerator.generateFamilyName(character.race);
    }
    
    // Generate parents if template includes them
    if (template.hasParents) {
      await generateParents(familyTree, character, familySurname);
    }
    
    // Generate siblings if template includes them
    if (template.hasSiblings) {
      await generateSiblings(familyTree, character, familySurname);
    }
    
    // Generate spouse if template includes one
    if (template.hasSpouse) {
      await generateSpouse(familyTree, character);
    }
    
    // Generate children if template includes them
    if (template.hasChildren) {
      await generateChildren(familyTree, character, familySurname);
    }
    
    // Generate extended family if depth > 1 and template includes them
    if (depth > 1 && template.hasExtendedFamily) {
      await generateExtendedFamily(familyTree, character, depth);
    }
    
    return familyTree;
  } catch (error) {
    console.error('Error generating family tree:', error);
    return {
      characterInfo: {
        name: character.name,
        race: character.race?.id || null,
        age: character.age,
        gender: character.gender
      },
      parents: [],
      siblings: [],
      spouse: null,
      children: [],
      extendedFamily: []
    };
  }
};

/**
 * Generate parents for a character
 * @param {Object} familyTree - Family tree being built
 * @param {Object} character - Main character
 * @param {string} familySurname - Family surname
 */
const generateParents = async (familyTree, character, familySurname) => {
  // Create father
  const father = {
    relation: 'father',
    race: character.race, // Usually same race, could be modified for mixed race
    gender: 'male',
    age: character.age + randomizer.getRandomInt(20, 40),
    isAlive: randomizer.getRandomBoolean(0.7) // 70% chance to be alive
  };
  
  father.name = await nameGenerator.generateName(father.race, father.gender);
  if (familySurname && !father.name.includes(familySurname)) {
    father.name = `${father.name.split(' ')[0]} ${familySurname}`;
  }
  
  // Create mother
  const mother = {
    relation: 'mother',
    race: character.race, // Usually same race, could be modified for mixed race
    gender: 'female',
    age: character.age + randomizer.getRandomInt(20, 35),
    isAlive: randomizer.getRandomBoolean(0.8) // 80% chance to be alive
  };
  
  mother.name = await nameGenerator.generateName(mother.race, mother.gender);
  if (familySurname && !mother.name.includes(familySurname)) {
    mother.name = `${mother.name.split(' ')[0]} ${familySurname}`;
  }
  
  familyTree.parents.push(father, mother);
};

/**
 * Generate siblings for a character
 * @param {Object} familyTree - Family tree being built
 * @param {Object} character - Main character
 * @param {string} familySurname - Family surname
 */
const generateSiblings = async (familyTree, character, familySurname) => {
  // Determine number of siblings
  const numSiblings = randomizer.getRandomInt(0, 3);
  
  for (let i = 0; i < numSiblings; i++) {
    // Determine if older or younger
    const isOlder = randomizer.getRandomBoolean();
    const ageDifference = randomizer.getRandomInt(1, 5);
    
    const sibling = {
      relation: isOlder ? 'older sibling' : 'younger sibling',
      race: character.race,
      gender: attributeGenerator.generateGender(),
      age: isOlder ? character.age + ageDifference : character.age - ageDifference,
      isAlive: randomizer.getRandomBoolean(0.95) // 95% chance to be alive
    };
    
    sibling.name = await nameGenerator.generateName(sibling.race, sibling.gender);
    if (familySurname && !sibling.name.includes(familySurname)) {
      sibling.name = `${sibling.name.split(' ')[0]} ${familySurname}`;
    }
    
    familyTree.siblings.push(sibling);
  }
};

/**
 * Generate spouse for a character
 * @param {Object} familyTree - Family tree being built
 * @param {Object} character - Main character
 */
const generateSpouse = async (familyTree, character) => {
  // Determine spouse details
  const spouseGenders = character.gender === 'male' ? ['female', 'male'] : 
                        character.gender === 'female' ? ['male', 'female'] : 
                        ['male', 'female', 'nonbinary'];
  
  const spouseGender = randomizer.getRandomItem(spouseGenders);
  
  const spouse = {
    relation: 'spouse',
    race: character.race, // Could randomize for inter-racial marriages
    gender: spouseGender,
    age: character.age + randomizer.getRandomInt(-3, 5),
    isAlive: randomizer.getRandomBoolean(0.9) // 90% chance to be alive
  };
  
  spouse.name = await nameGenerator.generateName(spouse.race, spouse.gender);
  
  familyTree.spouse = spouse;
};

/**
 * Generate children for a character
 * @param {Object} familyTree - Family tree being built
 * @param {Object} character - Main character
 * @param {string} familySurname - Family surname
 */
const generateChildren = async (familyTree, character, familySurname) => {
  // Only generate children if character is old enough
  if (character.age < 16) {
    return;
  }
  
  // Determine number of children
  const maxChildren = Math.floor((character.age - 16) / 2);
  const numChildren = randomizer.getRandomInt(0, Math.min(maxChildren, 5));
  
  for (let i = 0; i < numChildren; i++) {
    const childAge = randomizer.getRandomInt(0, character.age - 16);
    
    const child = {
      relation: 'child',
      race: character.race,
      gender: attributeGenerator.generateGender(),
      age: childAge,
      isAlive: randomizer.getRandomBoolean(0.98) // 98% chance to be alive
    };
    
    child.name = await nameGenerator.generateName(child.race, child.gender);
    if (familySurname && !child.name.includes(familySurname)) {
      child.name = `${child.name.split(' ')[0]} ${familySurname}`;
    }
    
    familyTree.children.push(child);
  }
};

/**
 * Generate extended family for a character
 * @param {Object} familyTree - Family tree being built
 * @param {Object} character - Main character
 * @param {number} depth - Tree depth
 */
const generateExtendedFamily = async (familyTree, character, depth) => {
  // Determine types of extended family to include
  const exFamilyTypes = ['grandparent', 'uncle/aunt', 'cousin'];
  const numTypes = randomizer.getRandomInt(1, exFamilyTypes.length);
  const selectedTypes = randomizer.getMultipleRandomItems(exFamilyTypes, numTypes);
  
  // For each type, generate 1-2 members
  for (const type of selectedTypes) {
    const numMembers = randomizer.getRandomInt(1, 2);
    
    for (let i = 0; i < numMembers; i++) {
      let familyMember;
      
      if (type === 'grandparent') {
        familyMember = {
          relation: 'grandparent',
          race: character.race,
          gender: attributeGenerator.generateGender(),
          age: character.age + randomizer.getRandomInt(40, 70),
          isAlive: randomizer.getRandomBoolean(0.6) // 60% chance to be alive
        };
      } else if (type === 'uncle/aunt') {
        const isUncle = randomizer.getRandomBoolean();
        familyMember = {
          relation: isUncle ? 'uncle' : 'aunt',
          race: character.race,
          gender: isUncle ? 'male' : 'female',
          age: character.age + randomizer.getRandomInt(20, 40),
          isAlive: randomizer.getRandomBoolean(0.8) // 80% chance to be alive
        };
      } else if (type === 'cousin') {
        familyMember = {
          relation: 'cousin',
          race: character.race,
          gender: attributeGenerator.generateGender(),
          age: character.age + randomizer.getRandomInt(-10, 10),
          isAlive: randomizer.getRandomBoolean(0.9) // 90% chance to be alive
        };
      }
      
      if (familyMember) {
        familyMember.name = await nameGenerator.generateName(familyMember.race, familyMember.gender);
        familyTree.extendedFamily.push(familyMember);
      }
    }
  }
};

module.exports = {
  generateFamilyTree
};