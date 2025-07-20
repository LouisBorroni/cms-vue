const db = require('../config/db');

exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, email, role FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erreur chargement utilisateurs' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await db.query('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression utilisateur' });
  }
};
