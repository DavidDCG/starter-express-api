const { dataReturn } = require('../helpers/constants');
const genericFunction = require('../helpers/generic_functions');

const validateUserData = (req, res) => {
    const user = { user: req.body.user, password: req.body.password };
    /// console.log(user);
    if (!genericFunction.isValidValue(user.user)) {
      dataReturn.type = "error"
      dataReturn.message = "valor para usuario no definido o no válido."
      dataReturn.valid = false;
      dataReturn.data = [];
    }
    if (!genericFunction.isValidValue(user.password)) {
      dataReturn.type = "error"
      dataReturn.message = "Valor para constraseña no definido o no válido."
      dataReturn.valid = false;
      dataReturn.data = [];
    }
    return dataReturn;
}
const validateModuleQuery = (req, res) => {
    const user = { idUser: req.body.idUser };
    if (!genericFunction.isValidValue(user.idUser)) {
      dataReturn.type = "error"
      dataReturn.message = "es necesario proporcionar el identificador del usuario."
      dataReturn.valid = false;
      dataReturn.data = [];
    }else{
      dataReturn.type = "module"
      dataReturn.message = "datos validos."
      dataReturn.valid = true;
      dataReturn.data = [];
    }

    return dataReturn;
}
module.exports = {
  validateUserData,
  validateModuleQuery
};