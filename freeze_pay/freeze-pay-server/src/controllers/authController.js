const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.query(
    'INSERT INTO users(name,email,password) VALUES($1,$2,$3)',
    [name, email, hash]
  );
  res.json({ success: true });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await db.query('SELECT * FROM users WHERE email=$1', [email]);
  if (!rows.length) return res.status(401).json({ error: 'Utilisateur non trouvé' });
  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Mot de passe invalide' });
  const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET);
  res.json({ token });
};
