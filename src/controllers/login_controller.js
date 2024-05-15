
const { connectToDatabase } = require('../../config/db');
const { dataReturn } = require('../helpers/constants');
const loginMiddleware = require('../middleware/login_middleware');

const login =  (req = request, res = response) => {
  try {
    // Lógica de autenticación y generación del token
    const userValid = loginMiddleware.validateUserData(req, res);
    if (!userValid.valid) {
      return res.json(userValid);
    }

    
    var client; // Variable para almacenar el cliente de MongoDB
    var db; // Variable para almacenar el cliente de MongoDB

    connectToDatabase().then((dataReturnDB) => {
      const user = { user: req.body.user, password: req.body.password };

       db = dataReturnDB.data.dataBase;
       client = dataReturnDB.data.dataClient;
      switch (dataReturnDB.valid) {
        case true:      
          return db.collection('hnt.employees').aggregate([
            {
              $match: { user: user.user, password: user.password, active: true }
            },
            {
              $lookup: {
                from: "hnt.roles",
                localField: "role_id",
                foreignField: "_id",
                as: "data_role"
              }              
            },
            {
              $lookup: {
                from: "hnt.areas",
                localField: "area_id",
                foreignField: "_id",
                as: "data_area"
              }
            },
            {
              $lookup: {
                from: "hnt.branches",
                localField: "branch_id",
                foreignField: "_id",
                as: "data_branch"
              }
            },
            {
              $lookup: {
                from: "hnt.roles",
                localField: "role_id",
                foreignField: "_id",
                as: "data_role"
              }              
            },
            {
              $lookup: {
                from: "hnt.companies",
                localField: "data_branch.company_id",
                foreignField: "_id",
                as: "company_data_branch"
              }
            },
            {
              $lookup: {
                from: "hnt.companies",
                localField: "data_area.company_id",
                foreignField: "_id",
                as: "company_data_area"
              }
            },
            {
              $lookup: {
                from: "hnt.config_permissions",
                localField: "role_id",
                foreignField: "role_id",
                as: "data_config_modules"
              }
            },
            {
              $lookup: {
                from: "hnt.config_modules",
                localField: "data_config_modules.module_id",
                foreignField: "_id",
                as: "data_modules"
              }
            },
            {
              $lookup: {
                from: "hnt.companies",
                localField: "data_branch.branch_id",
                foreignField: "_id",
                as: "company_data_branch"
              }
            },
            {
              $addFields: {
                "data_area.company_data": "$company_data_area"
              }
            },
            {
              $addFields: {
                "data_branch.company_data": "$company_data_branch"
              }
            },
            {
              $project: {
                "_id": 1,
                "name_employee": 1,
                "data_area": 1,
                "data_role": 1, // Incluir solo los datos del rol
               // "company_data": 1
                "data_branche": 1,
               // "data_config_modules": 1,
                "data_modules": 1
              }
            }
             
          ]).toArray();
        case false:
          res.json(dataReturnDB);
          break;
      }
    }).then(async (dataReturnResult) => {   
      console.log(dataReturnResult);

      if (dataReturnResult.length > 0) {
        dataReturn.valid = true;
        dataReturn.type = "success";
        dataReturn.message = "consulta correcta";
        dataReturn.data = dataReturnResult
      } else {
        dataReturn.valid = false;
        dataReturn.type = "success";
        dataReturn.message = "Usuario o contraseña no reconocido";
        dataReturn.data = [];
      }

      res.json(dataReturn);
      await client.close();
   
    }).catch(async (err) => {
      dataReturn.valid = false;
      dataReturn.type = "error";
      dataReturn.message = "error interno del servidor " + err;
      dataReturn.data = err;
      res.json(dataReturn);
      await client.close();
    });



  } catch (err) {
    const dataReturn = {
      valid: false,
      type: "error",
      message: "Error interno del servidor: " + err.message,
      data: err
    };
    return res.json(dataReturn);
  }
};

module.exports = {
  login
};