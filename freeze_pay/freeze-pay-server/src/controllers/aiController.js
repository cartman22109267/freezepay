const fetch = require('node-fetch');
require('dotenv').config();

exports.suggestions = async (req, res) => {
  const resp = await fetch(`${process.env.FLASK_AI_URL}/suggest`);
  const data = await resp.json();
  res.json({ suggestions: data });
};
