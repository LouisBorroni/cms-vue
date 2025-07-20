const db = require('../config/db')

exports.getAllArticles = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM articles')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des articles' })
  }
}

exports.createArticle = async (req, res) => {
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
}

exports.updateArticle = async (req, res) => {
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
}

exports.deleteArticle = async (req, res) => {
  const { id } = req.params
  try {
    await db.query('DELETE FROM articles WHERE id = ?', [id])
    res.json({ message: 'Article supprimé' })
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la suppression' })
  }
}
