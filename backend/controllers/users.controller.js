const db = require('../config/db');

exports.me = async (req, res) => {
  try {
    const userId = req.user.id;  
    const [rows] = await db.query('SELECT id, email FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

