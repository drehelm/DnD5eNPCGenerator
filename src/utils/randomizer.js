/**
 * Get a random item from an array
 * @param {Array} array - Array to choose from
 * @returns {*} - Random item from the array
 */
const getRandomItem = (array) => {
  if (!array || array.length === 0) {
    return null;
  }
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Get a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer in range
 */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Get multiple random items from an array without duplicates
 * @param {Array} array - Array to choose from
 * @param {number} count - Number of items to select
 * @returns {Array} - Array of unique random items
 */
const getMultipleRandomItems = (array, count) => {
  if (!array || array.length === 0) {
    return [];
  }
  
  // If count is greater than array length, return shuffled array
  if (count >= array.length) {
    return shuffleArray([...array]);
  }
  
  const result = [];
  const arrayCopy = [...array];
  
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * arrayCopy.length);
    result.push(arrayCopy[randomIndex]);
    arrayCopy.splice(randomIndex, 1);
  }
  
  return result;
};

/**
 * Get a random item from a weighted list
 * @param {Array} items - Array of items, each with a weight property
 * @returns {*} - Random item selected by weight
 */
const getRandomWeightedItem = (items) => {
  if (!items || items.length === 0) {
    return null;
  }
  
  // Calculate total weight
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
  
  // Generate a random value between 0 and totalWeight
  let random = Math.random() * totalWeight;
  
  // Find the item based on its weight
  for (const item of items) {
    const weight = item.weight || 1;
    if (random < weight) {
      return item;
    }
    random -= weight;
  }
  
  // Fallback to first item (should not happen)
  return items[0];
};

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
const shuffleArray = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Get true or false based on probability
 * @param {number} probability - Probability of true (0-1)
 * @returns {boolean} - Random boolean
 */
const getRandomBoolean = (probability = 0.5) => {
  return Math.random() < probability;
};

module.exports = {
  getRandomItem,
  getRandomInt,
  getMultipleRandomItems,
  getRandomWeightedItem,
  shuffleArray,
  getRandomBoolean
};