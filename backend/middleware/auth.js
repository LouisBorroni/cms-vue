// auth.js
const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  const token = req.cookies?.token 

  if (!token) return res.status(401).json({ error: 'Access denied' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
