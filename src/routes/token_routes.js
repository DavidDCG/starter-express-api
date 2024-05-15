const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth_middleware');
const tokenControlller = require('../controllers/token_controller');
// Ruta de autenticación
router.post('/generate', authMiddleware.validCredentials, (req, res) => {
 tokenControlller.generateToken(req, res);
});
// Ruta de autenticación
router.get('/verifyToken', authMiddleware.verifyToken, (req, res) => {
    tokenControlller.verifyToken(req, res);
   });
module.exports = router;