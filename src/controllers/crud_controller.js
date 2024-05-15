const { connectToDatabase } = require('../../config/db');
const { dataReturn } = require('../helpers/constants');
const { ObjectId } = require('mongodb');
const genericFunction = require('../helpers/generic_functions');
require('dotenv').config();

const operation_crud = (req = request, res = response, data_operation) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        let date_current = new Date(genericFunction.subtractHoursToDate(new Date(), parseInt(process.env.SUBTRACT_HOURS)));
        if (!genericFunction.isValidValue(req.body.update_date)) {
            req.body.update_date = date_current.toISOString();;
        }
        var return_data = data_operation.return_data;
        var body = req.body;
        
        if (data_operation.typeReplace.includes("ObjectId")) {
        
            body = genericFunction.replaceValueProperties(body, data_operation.dataReplaceObjectId, "ObjectId");
        }
        if (data_operation.typeReplace.includes("DateTime")) {
            body = genericFunction.replaceValueProperties(body, data_operation.dataReplaceDateTime, "DateTime");
        }

       

        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            switch (data_operation.type) {
                case "insert":
                    body.create_date = date_current;
                    body.update_date = date_current;
                    return db.collection(data_operation.name_collection).insertOne(body);
                case "read":
                    return db.collection(data_operation.name_collection).aggregate(data_operation.query).toArray();
                case "update":
                    return db.collection(data_operation.name_collection).updateOne(
                        data_operation.filter,
                        data_operation.query
                    );
                case "delete":
                    //console.log(data_operation.query);
                    return db.collection(data_operation.name_collection).deleteMany(data_operation.query);
            }

        }).then((dataReturnResult) => {
            // console.log("valor",dataReturnResult);
            if (dataReturnResult.acknowledged || dataReturnResult.length > 0) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "operacion " + data_operation.type + " realizada correctamente.";
                dataReturn.data = dataReturnResult
                if (return_data) {
                    console.log(return_data)
                    return dataReturn;
                } else {
                    res.json(dataReturn);
                }
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al realizar la operacion " + data_operation.type;
                dataReturn.data = dataReturnResult
                if (return_data) {
                    return dataReturn;
                } else {
                    res.status(400).json(dataReturn);
                }
            }

            client.close();
        }).catch((err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message = "error interno del servidor: " + err;
            dataReturn.data = err;
            if (return_data) {
                return dataReturn;
            } else {
                res.status(400).json(dataReturn);
            }
        });

    } catch (err) {
        const dataReturn = {
            valid: false,
            type: "error",
            message: "error interno del servidor: " + err.message,
            data: err
        };
        if (return_data) {
            return dataReturn;
        } else {
            res.status(400).json(dataReturn);
        }
    }
};

module.exports = {
    operation_crud
};

