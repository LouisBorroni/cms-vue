const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  )
}


exports.register = async (req, res) => {
  const { email, password } = req.body

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Email invalide' })
  }

  if (!isStrongPassword(password)) {
    return res.status(400).json({
      error: 'Mot de passe trop faible : min. 8 caractères avec majuscule, minuscule, chiffre, symbole',
    })
  }

  try {
    const hashed = await bcrypt.hash(password, 10)
    await db.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashed, 'user']
    )
    res.status(201).json({ message: 'User created' })
  } catch (err) {
    console.error('Register error:', err)
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already used' })
    } else {
      res.status(500).json({ error: 'Database error' })
    }
  }
}



exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.me = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.query('SELECT id, email, role FROM users WHERE id = ?', [userId]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch user' });
  }
};
