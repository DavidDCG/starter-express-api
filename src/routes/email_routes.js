const express = require('express');
const router = express.Router();
const EmailController = require('../controllers/email_controller');

// Ruta de autenticación
router.post('/send', (req, res) => {
    EmailController.SendEmail(req, res);
});


module.exports = router;