const router = require('express').Router();
const pc = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

router.post('/qr',       authenticate, pc.payQR);
router.post('/nfc',      authenticate, pc.payNFC);
router.post('/bluetooth',authenticate, pc.payBT);
router.post('/contact',  authenticate, pc.payContact);
router.get('/history',   authenticate, pc.history);

module.exports = router;
