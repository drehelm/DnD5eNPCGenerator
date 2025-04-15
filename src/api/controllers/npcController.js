const path = require('path');
const fs = require('fs').promises;
const npcGenerator = require('../../generators/npcGenerator');
const dataLoader = require('../../utils/dataLoader');

/**
 * Get all available races
 */
const getRaces = async (req, res) => {
  try {
    const races = await dataLoader.loadRaces();
    res.json(races);
  } catch (error) {
    console.error('Error loading races:', error);
    res.status(500).json({ error: 'Failed to load races' });
  }
};

/**
 * Get all available classes
 */
const getClasses = async (req, res) => {
  try {
    const classes = await dataLoader.loadClasses();
    res.json(classes);
  } catch (error) {
    console.error('Error loading classes:', error);
    res.status(500).json({ error: 'Failed to load classes' });
  }
};

/**
 * Generate a complete NPC based on parameters
 */
const generateNPC = async (req, res) => {
  try {
    const parameters = req.body;
    const npc = await npcGenerator.generateNPC(parameters);
    res.json(npc);
  } catch (error) {
    console.error('Error generating NPC:', error);
    res.status(500).json({ error: 'Failed to generate NPC' });
  }
};

/**
 * Regenerate specific attributes of an NPC
 */
const regenerateAttributes = async (req, res) => {
  try {
    const { npc, attributesToRegenerate } = req.body;
    const regeneratedNPC = await npcGenerator.regenerateAttributes(npc, attributesToRegenerate);
    res.json(regeneratedNPC);
  } catch (error) {
    console.error('Error regenerating attributes:', error);
    res.status(500).json({ error: 'Failed to regenerate attributes' });
  }
};

module.exports = {
  getRaces,
  getClasses,
  generateNPC,
  regenerateAttributes
};