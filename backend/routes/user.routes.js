const express = require('express');
const router = express.Router();

// Pour l'instant, on retourne une liste vide de users
router.get('/', (req, res) => {
  res.json([]);
});

module.exports = router;
