const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login_controller');
const authMiddleware = require('../middleware/auth_middleware');
// Ruta de autenticación
router.post('/access',authMiddleware.verifyToken, (req, res) => {
 loginController.login(req, res);
});

module.exports = router;