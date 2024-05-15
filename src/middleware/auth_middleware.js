// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const { dataReturn } = require('../helpers/constants');
const genericFunction  = require ('../helpers/generic_functions');
require('dotenv').config();
const secretKey = process.env.SECRET_KEY; // Cambia esto con una clave segura
// Función para generar un token JWT
function generateToken(user) {
  return jwt.sign({ user }, secretKey, { expiresIn: '24h' });
}

const verifyToken = (req, res, next) =>  {
  // Obtener el token del encabezado "Authorization"
  const authHeader = req.headers['authorization'];
  // Verificar si el encabezado está presente
  if (!authHeader) {
    dataReturn.message = "Token no proporcionado"
    dataReturn.valid = false;
    dataReturn.data = [{ bearer_Token: authHeader, status: 403 }];
    dataReturn.type = "verify"
     res.status(403).json(dataReturn);
  } else {
    // Verificar si el encabezado comienza con "Bearer "
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      dataReturn.message = "Formato de token no válido"
      dataReturn.valid = false;
      dataReturn.data = [{ bearer_Token: authHeader, status: 401 }];
      dataReturn.type = "verify";
     
     res.status(401).json(dataReturn);
    }
    // Obtener el token desde la segunda parte del encabezado
    const token = tokenParts[1];
    // Verificar el token utilizando la clave secreta
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        dataReturn.message = "Token no válido";
        dataReturn.valid = false;
        dataReturn.data = [{ bearer_Token: authHeader, status: 401 }];
        dataReturn.type = "verify"
     res.status(401).json(dataReturn);
      } else {
        dataReturn.message = "Token válido";
        dataReturn.valid = true;
        dataReturn.data = [{ bearer_Token: authHeader, status: 202 }];
        dataReturn.type = "verify"
        next()
      }
    });
  }

 // return dataReturn;
}
const validCredentials = (req, res, next) => {
  const user = { user: req.body.user, password: req.body.password };
  console.log(user);
  if(!genericFunction.isValidValue(user.user)){
    dataReturn.type = "error"
    dataReturn.message = "valor para usuario no definido o no válido."
    dataReturn.valid = false;
    dataReturn.data = [];
    return res.status(401).json(dataReturn);   
  }
  if(!genericFunction.isValidValue(user.password)){
    dataReturn.type = "error"
    dataReturn.message = "Valor para constraseña no definido o no válido."
    dataReturn.valid = false;
    dataReturn.data = [];
    return res.status(401).json(dataReturn);   
  }  
  next();
}

module.exports = { generateToken, verifyToken, validCredentials };
