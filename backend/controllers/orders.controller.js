const db = require('../config/db');
const jwt = require('jsonwebtoken')

exports.createOrder = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Token missing' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id

    const { items, total } = req.body

    if (!items || !total) {
      return res.status(400).json({ error: 'Missing order data' })
    }

    const itemsString = JSON.stringify(items)

    const [result] = await db.query(
      'INSERT INTO orders (user_id, items, total) VALUES (?, ?, ?)',
      [userId, itemsString, total]
    )

    res.status(201).json({ message: 'Order created', orderId: result.insertId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create order' })
  }
}

exports.getOrdersByUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Token missing' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userId = decoded.id

    const [orders] = await db.query(
      'SELECT id, user_id, items, total, created_at FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    )

    res.json(orders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}
