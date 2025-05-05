const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const pc = require('../controllers/paymentController');

router.get('/profile', authenticate, pc.profile);

module.exports = router;
