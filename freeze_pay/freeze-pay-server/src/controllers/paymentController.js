const db = require('../config/db');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function record(userId, method, amount, currency, status, detail) {
  await db.query(
    `INSERT INTO transactions(user_id,method,amount,currency,status,detail)
     VALUES($1,$2,$3,$4,$5,$6)`,
    [userId, method, amount, currency, status, detail]
  );
}

exports.payQR = async (req, res) => {
  const { data, amount, currency } = req.body;
  await record(req.user.id, 'qr', amount, currency, 'completed', data);
  res.json({ success: true });
};

exports.payNFC = async (req, res) => {
  const { tag, amount, currency } = req.body;
  await record(req.user.id, 'nfc', amount, currency, 'completed', JSON.stringify(tag));
  res.json({ success: true });
};

exports.payBT = async (req, res) => {
  const { deviceId, amount, currency } = req.body;
  await record(req.user.id, 'bluetooth', amount, currency, 'completed', deviceId);
  res.json({ success: true });
};

exports.payContact = async (req, res) => {
  const { accountNumber, amount, currency } = req.body;
  await record(req.user.id, 'contact', amount, currency, 'pending', accountNumber);
  res.json({ success: true });
};

exports.history = async (req, res) => {
  const { rows } = await db.query(
    'SELECT * FROM transactions WHERE user_id=$1 ORDER BY created_at DESC',
    [req.user.id]
  );
  res.json(rows);
};

exports.profile = async (req, res) => {
  const { rows } = await db.query(
    'SELECT id,name,email,created_at FROM users WHERE id=$1',
    [req.user.id]
  );
  res.json(rows[0]);
};
