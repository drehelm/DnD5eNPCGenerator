const express = require('express');
const router = express.Router();
const npcController = require('./controllers/npcController');

// Get all available races
router.get('/races', npcController.getRaces);

// Get all available classes
router.get('/classes', npcController.getClasses);

// Generate a complete NPC
router.post('/generate', npcController.generateNPC);

// Regenerate specific NPC attributes
router.post('/regenerate', npcController.regenerateAttributes);

module.exports = router;