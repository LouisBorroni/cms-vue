const db = require('../config/db');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { items, total } = req.body;

    if (!items || !total) {
      return res.status(400).json({ error: 'Données de commande manquantes' });
    }

    const itemsString = JSON.stringify(items);

    const [result] = await db.query(
      'INSERT INTO orders (user_id, items, total) VALUES (?, ?, ?)',
      [userId, itemsString, total]
    );

    res.status(201).json({ message: 'Commande créée', orderId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création de la commande' });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await db.query(
      'SELECT id, user_id, items, total, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
};
