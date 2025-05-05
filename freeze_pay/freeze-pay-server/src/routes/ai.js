const router = require('express').Router();
const { suggestions } = require('../controllers/aiController');

router.get('/suggestions', suggestions);

module.exports = router;
