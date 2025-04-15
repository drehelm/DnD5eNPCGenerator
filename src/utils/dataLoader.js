const fs = require('fs').promises;
const path = require('path');

/**
 * Load data from a JSON file
 * @param {string} fileName - Name of the JSON file to load
 * @returns {Promise<Object>} - Parsed JSON data
 */
const loadData = async (fileName) => {
  try {
    const filePath = path.join(__dirname, '../../data', fileName);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${fileName}:`, error);
    throw error;
  }
};

/**
 * Load races data
 * @returns {Promise<Array>} - Array of race objects
 */
const loadRaces = async () => {
  return loadData('races.json');
};

/**
 * Load classes data
 * @returns {Promise<Array>} - Array of class objects
 */
const loadClasses = async () => {
  return loadData('classes.json');
};

/**
 * Load names data
 * @returns {Promise<Object>} - Names organized by race and gender
 */
const loadNames = async () => {
  return loadData('names.json');
};

/**
 * Load quirks data
 * @returns {Promise<Array>} - Array of quirk objects
 */
const loadQuirks = async () => {
  return loadData('quirks.json');
};

/**
 * Load traits data
 * @returns {Promise<Array>} - Array of trait objects
 */
const loadTraits = async () => {
  return loadData('traits.json');
};

/**
 * Load flaws data
 * @returns {Promise<Array>} - Array of flaw objects
 */
const loadFlaws = async () => {
  return loadData('flaws.json');
};

/**
 * Load family templates data
 * @returns {Promise<Array>} - Array of family template objects
 */
const loadFamilyTemplates = async () => {
  return loadData('familyTemplates.json');
};

module.exports = {
  loadRaces,
  loadClasses,
  loadNames,
  loadQuirks,
  loadTraits,
  loadFlaws,
  loadFamilyTemplates
};