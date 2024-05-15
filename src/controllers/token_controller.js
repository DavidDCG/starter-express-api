const authMiddleware = require('../middleware/auth_middleware');
const { connectToDatabase } = require('../../config/db');
const { dataReturn } = require('../helpers/constants');

const generateToken = (req = request, res = response) => {
  // Lógica de autenticación y generación del token

  var client; // Variable para almacenar el cliente de MongoDB
  var db; // Variable para almacenar el cliente de MongoDB
  const user = { user: req.body.user, password: req.body.password };
  connectToDatabase().then((dataReturnDB) => {
    switch (dataReturnDB.valid) {
      case true:
         db = dataReturnDB.data.dataBase;
         client = dataReturnDB.data.dataClient;
        return db.collection('hnt.employees').find({ nameUser: user.username, password: user.password }).toArray();
      case false:
        res.json(dataReturnDB);
        break;
    }
  }).then(async (dataReturnResult) => {
    console.log(dataReturnResult);
    if (dataReturnResult.length > 0) {
      dataReturn.valid = true;
      dataReturn.type = "success";
      dataReturn.message = "consulta correcta.";
      dataReturn.data = dataReturnResult;
      const token = authMiddleware.generateToken(user);
      dataReturn.data = { token: token };
    } else {
      dataReturn.valid = false;
      dataReturn.type = "success";
      dataReturn.message = "Usuario o contraseña no reconocido.";
      dataReturn.data = [];
    }
    res.json(dataReturn);
    await client.close();
  }).catch( async (err) => {
    dataReturn.valid = false;
    dataReturn.type = "error";
    dataReturn.message = "error interno del servidor." + err;
    dataReturn.data = err;
    res.json(dataReturn);
    await client.close();
  });
}

const verifyToken = (req = request, res = response) => {
  const authHeader = req.headers['authorization'];
  dataReturn.valid = true;
  dataReturn.type = "token";
  dataReturn.message = "token válido";
  dataReturn.data = {
    "bearer_Token": authHeader
  }
  res.json(dataReturn);
}

module.exports = {
  generateToken,
  verifyToken
};