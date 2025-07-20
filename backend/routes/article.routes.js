const express = require('express')
const router = express.Router()
const db = require('../config/db')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM articles')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des articles' })
  }
})

router.post('/', auth, async (req, res) => {
  const { name, description, price, image_url } = req.body
  try {
    await db.query(
      'INSERT INTO articles (name, description, price, image_url) VALUES (?, ?, ?, ?)',
      [name, description, price, image_url]
    )
    res.status(201).json({ message: 'Article ajouté' })
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’ajout de l’article' })
  }
})

router.put('/:id', auth, async (req, res) => {
  const { id } = req.params
  const { name, description, price, image_url } = req.body
  try {
    await db.query(
      'UPDATE articles SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?',
      [name, description, price, image_url, id]
    )
    res.json({ message: 'Article mis à jour' })
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la modification' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params
  try {
    await db.query('DELETE FROM articles WHERE id = ?', [id])
    res.json({ message: 'Article supprimé' })
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression' })
  }
})

module.exports = router
