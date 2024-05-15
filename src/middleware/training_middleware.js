const { dataReturn } = require('../helpers/constants');
const genericFunction = require('../helpers/generic_functions');
const { Validator } = require('jsonschema');
const validator = new Validator();
const { connectToDatabase } = require('../../config/db');
const { ObjectId } = require('mongodb');
const schemaData = require('../schema/training_schema');

const schemaTask = schemaData.schemainsertTask;
const dataTaskUpdate = schemaData.dataUpdateTask;
const schemaEvaluations = schemaData.schemaEvaluations;
const schemaEvaluationsAnswers = schemaData.schemaEvaluationsAnswers;

// Método para validar el cuerpo de la solicitud
const validate_task = (req, res, next, type) => {
    try {
        var db;
        var client;
        const requestBody = req.body;
        //console.log(type);
        if (type == "update") {
            delete schemaTask.required;
        }
        //const bodyValid = genericFunction.validateFields(type == "update" ? dataRequired : dataRequired, requestBody);
        //console.log("ddd");
        //console.log(bodyValid);
        // if (!bodyValid.valid) {   
        //   throw  "formato de "+type+" no válido - " + bodyValid.message;
        // }
        const validationResult = validator.validate(requestBody, schemaTask);
        const errors = validationResult.errors.map(error => error.stack);
        if (!validationResult.valid) {
            dataReturn.message = "formato de " + type + " no válido";
            dataReturn.valid = false;
            dataReturn.data = errors;
            dataReturn.type = "task";
            res.status(400).json(dataReturn);
        }
        else {
            if (type == "update") {
                next();
            } else {

                console.log(validationResult);
                // Accediendo a los atributos de segmentation
                const segmentation = requestBody.segmentation;
                const areas = segmentation.areas;
                const branches = segmentation.branches;
                const companies = segmentation.companies;
                const type_collaborators = segmentation.type_collaborators;

                const category_id = requestBody.category_id;

                const evaluations_id = requestBody.evaluations_id;
                          
                connectToDatabase().then((dataReturnDB) => {
                    switch (dataReturnDB.valid) {
                        case true:
                            db = dataReturnDB.data.dataBase;
                            client = dataReturnDB.data.dataClient;
                            let promise = []

                            const result_category = db.collection('hnt.categories').find({ _id: new ObjectId(category_id) }).toArray()                           
                            promise.push(result_category);
                            
                            if(genericFunction.isValidValue(evaluations_id)){                 
                                const result_evaluation = db.collection('training.evaluations').find({ _id: new ObjectId(evaluations_id) }).toArray()
                                promise.push(result_evaluation);
                            }
                            for (const area of areas) {
                                const result = db.collection('hnt.areas').find({ _id: new ObjectId(area) }).toArray()
                                promise.push(result);
                            }
                            for (const branch of branches) {
                                const result = db.collection('hnt.branches').find({ _id: new ObjectId(branch) }).toArray()
                                promise.push(result);
                            }

                            for (const company of companies) {
                                const result = db.collection('hnt.companies').find({ _id: new ObjectId(company) }).toArray()
                                promise.push(result);
                            }

                            for (const type_collaborator of type_collaborators) {
                                const result = db.collection('hnt.type_collaborators').find({ _id: new ObjectId(type_collaborator) }).toArray()
                                promise.push(result);
                            }
                        
                            // const branches = segmentation.branches;
                            // const companies = segmentation.companies;                          
                           // console.log(result_evaluation);

                            return Promise.all(promise);
                        case false:
                            res.json(dataReturnDB);
                            break;
                    }
                }).then(async (dataReturnResult) => {

                    for (let i = 0; i < dataReturnResult.length; i++) {
                        if (dataReturnResult[i].length == 0) {
                            throw new Error('No todos los datos de categoría/evaluations/segmentación existen en la base de datos favor de validar. posicion[' + i + ']');
                        }
                        // console.log("Elemento:", miArray[i], "Posición:", i);
                    }
                    client.close();
                    next();
                }).catch((err) => {
                    dataReturn.valid = false;
                    dataReturn.type = "error";
                    dataReturn.message = err.message;
                    dataReturn.data = err;
                    res.status(400).json(dataReturn);
                });

            }
        }
    } catch (errors) {
        dataReturn.message = errors
        dataReturn.valid = false;
        dataReturn.data = [errors];
        dataReturn.type = "task";
        res.status(400).json(dataReturn);
    }

}

const validate_task_evaluations = (req, res, next,type) => {
    try {
        const requestBody = req.body;      
        const validationResult = validator.validate(requestBody, schemaEvaluations);
        const errors = validationResult.errors.map(error => error.stack);
        if (validationResult.valid === false) {
            dataReturn.message = "formato de body no válido";
            dataReturn.valid = false;
            dataReturn.data = errors;
            dataReturn.type = "task";
            // console.log(errors);
            res.status(400).json(dataReturn);
        }
        else {
            next();
        }
    } catch (errors) {
        dataReturn.message = errors
        dataReturn.valid = false;
        dataReturn.data = errors;
        dataReturn.type = "task";
        res.status(400).json(dataReturn);
    }

}

const validate_task_evaluations_answers = (req, res, next,type) => {
    try {
        const requestBody = req.body;      
        const validationResult = validator.validate(requestBody, schemaEvaluationsAnswers);
        const errors = validationResult.errors.map(error => error.stack);
        if (validationResult.valid === false) {
            dataReturn.message = "formato de body no válido";
            dataReturn.valid = false;
            dataReturn.data = errors;
            dataReturn.type = "task";
            res.status(400).json(dataReturn);
        }
        else {
            next();
        }
    } catch (errors) {
        dataReturn.message = errors
        dataReturn.valid = false;
        dataReturn.data = errors;
        dataReturn.type = "task";
        res.status(400).json(dataReturn);
    }

}

const validate_task_evaluations_delete = (req, res, next) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;

            return db.collection('training.evaluations_answers').aggregate([
                {
                    $match: { evaluation_id: new ObjectId(req.params.id) } 
                },
                {
                    $project: {
                        '_id': 1,                  
                    }
                }

            ]).toArray();

        }).then(async (dataReturnResult) => {
         
            if (dataReturnResult.length > 0) {
                dataReturn.valid = false;
                dataReturn.type = "valid";
                dataReturn.message = "se han encontrado registros en training.evaluations_answers para esta evaluacion, debes primero borrar estos registros para poder eliminar.";
                dataReturn.data = dataReturnResult
                res.status(400).json(dataReturn);
            } else {
               next();
            }
           
            await client.close()
        }).catch(async (err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message = "error interno del servidor: " + err;
            dataReturn.data = err;
            res.status(400).json(dataReturn);
        });

    } catch (err) {
        const dataReturn = {
            valid: false,
            type: "error",
            message: "error interno del servidor: " + err.message,
            data: err
        };
        return res.json(dataReturn);
    }

}


module.exports = {
    validate_task,
    validate_task_evaluations,
    validate_task_evaluations_answers,
    validate_task_evaluations_delete
};

