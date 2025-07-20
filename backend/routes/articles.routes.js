const express = require('express')
const router = express.Router()
const articlesController = require('../controllers/articles.controller')
const auth = require('../middleware/auth')
const checkAdmin = require('../middleware/checkAdmin')


router.get('/', articlesController.getAllArticles)

router.post('/', auth, checkAdmin, articlesController.createArticle)
router.put('/:id', auth, checkAdmin, articlesController.updateArticle)
router.delete('/:id', auth, checkAdmin, articlesController.deleteArticle)

module.exports = router
