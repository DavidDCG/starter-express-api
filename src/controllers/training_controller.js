const { connectToDatabase } = require('../../config/db');
const { dataReturn } = require('../helpers/constants');
const { ObjectId } = require('mongodb');
const genericFunction = require('../helpers/generic_functions');
const crudController = require('../controllers/crud_controller');
const { generateToken } = require('../middleware/auth_middleware');

////
//let date_current = new Date(genericFunction.subtractHoursToDate(new Date(),parseInt(process.env.SUBTRACT_HOURS)));

const insert_task = (req = request, res = response) => {
    try {
        var date_current = new Date(genericFunction.subtractHoursToDate(new Date(), parseInt(process.env.SUBTRACT_HOURS)));
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        req.body.create_date = date_current;
        req.body.update_date = date_current;
        req.body.category_id = new ObjectId(req.body.category_id)
        req.body.from = new Date(req.body.from);
        req.body.to = new Date(req.body.to);
        req.body.active = true;

        const segmentation = req.body.segmentation;
        const areas = segmentation.areas;
        const branches = segmentation.branches;
        const companies = segmentation.companies;
        const type_collaborators = segmentation.type_collaborators;
        const evaluation_id = req.body.evaluation_id;

       
        areas.forEach((elemento, indice, areas) => {
            areas[indice] = new ObjectId(elemento);
        });

        branches.forEach((elemento, indice, branches) => {
            branches[indice] = new ObjectId(elemento);
        });

        companies.forEach((elemento, indice, companies) => {
            companies[indice] = new ObjectId(elemento);
        });

        type_collaborators.forEach((elemento, indice, type_collaborators) => {
            type_collaborators[indice] = new ObjectId(elemento);
        });

         // console.log(genericFunction.isValidValue(evaluation_id));
         if (genericFunction.isValidValue(evaluation_id)) {
            req.body.evaluation_id = new ObjectId(evaluation_id);
        }


        console.log(req.body);
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('training.tasks').insertOne(req.body);

        }).then((dataReturnResult) => {

            if (dataReturnResult.acknowledged) {

                getUsersSegmentation(req, res, areas, branches, companies, type_collaborators, dataReturnResult)
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al insertar";
                dataReturn.data = dataReturnResult
                res.json(dataReturn);
            }

             client.close();
        }).catch((err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message = "error interno del servidor: " + err;
            dataReturn.data = err;
            res.json(dataReturn);
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
};

const getUsersSegmentation = (req = request, res = response, areas, branches, companies, type_collaborators, dataReturnResultTask) => {
    try {

        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB

        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;

           
            if( areas == [] || !genericFunction.isValidValue(areas) ){
                areas = [""]
            }
            if( branches == []  || !genericFunction.isValidValue(branches) ){
                branches = [""]
            }
            if(companies == []  || !genericFunction.isValidValue(companies)){
                companies = [""]
            }
            if(type_collaborators == []  || !genericFunction.isValidValue(type_collaborators)){
                type_collaborators = [""]
            }

            const filtro = {
                   $or: [
                      { company_id: { $in: companies } },
                      { area_id: { $in: areas } },
                     { branch_id: { $in: branches } },
                     { type_collaborator_id: { $in: type_collaborators } }
                 ]
               // company_id : { $in: companies },
               // area_id : { $in: areas },
               // branch_id : { $in: branches },
                //type_collaborator_id : { $in: type_collaborators }
            };
           
            return db.collection('hnt.employees').find(filtro).toArray();

        }).then(async (dataReturnResult) => {

            console.log("USUARIOS encontrados");
            console.log(dataReturnResult);

            if (dataReturnResult.length > 0) {
                insertOnbordingUsers(req, res, dataReturnResult, dataReturnResultTask)
            } else {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "se insertó/modificó la tarea, pero no se encontraron usuarios";
                dataReturn.data = dataReturnResultTask
                res.json(dataReturn);
            }

            await client.close();
        }).catch((err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message = "error interno del servidor: " + err;
            dataReturn.data = err;
            res.json(dataReturn);
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
};

const insertOnbordingUsers = (req, res, dataUserMatch, dataReturnResultTask) => {
    try {
        var date_current = new Date(genericFunction.subtractHoursToDate(new Date(), parseInt(process.env.SUBTRACT_HOURS)));

        console.log("DATOS FINALES PARA INSERT")
        console.log(dataUserMatch);
        console.log(dataReturnResultTask);

        var userInsert = [];
        dataUserMatch.forEach((elemento, indice, dataUserMatch) => {
            userInsert.push({
                task_id: dataReturnResultTask.insertedId,
                user_id: elemento._id,
                status: "Not Started",
                expiration: new Date(),
                active: true,
                create_date: date_current,
                update_date: date_current
            })
        });

        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB


        console.log("Datos", userInsert);

        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('training.onbording_users').insertMany(userInsert);

        }).then(async (dataReturnResult) => {

            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "succes";
                dataReturn.message = "tarea y usuarios insertados correctamente";
                dataReturn.data = dataReturnResult
                res.json(dataReturn);
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al insertar";
                dataReturn.data = dataReturnResult
                res.json(dataReturn);
            }

            await client.close();
        }).catch((err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message = "error interno del servidor: " + err;
            dataReturn.data = err;
            res.json(dataReturn);
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
};

const getTasks = (req = request, res = response) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;

            let dataReturn = {
                '_id': 1,
                'title': 1,
                'icon_path': 1,
                'content': 1,
                'attachments': 1,
                'expiration_amount': 1,
                'has_expiration': 1,
                'expiration_sequence': 1,
                'expiration_time': 1,
                'category_id': 1,
                'send_notification': 1,
                'segmentation_type': 1,
                'segmentation': 1,
                'autoAssign': 1,
                'type_assignment': 1,
                'from': 1,
                'to': 1,
                'priority': 1,
                'order': 1,
                'evaluation_id': 1,
                'create_date': 1,
                'update_date': 1,
                'active': 1
            }


            let pipeline = [];

            const taskId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
            // Agregar la etapa $match solo si se proporciona un valor para filtrar
            if (genericFunction.isValidValue(taskId)) {
                pipeline.push({ $match: { '_id': new ObjectId(taskId) } });
            }
            // Agregar la etapa $match para filtrar solo las tareas activas
            pipeline.push({ $match: { 'active': true } });

            // Agregar la etapa $project para proyectar los campos deseados
            pipeline.push({ $project: dataReturn });

            console.log(pipeline)

            return db.collection('training.tasks').aggregate(pipeline).toArray();

        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.length > 0) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "consulta correcta";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = dataReturnResult;
            }
            res.json(dataReturn);
            await client.close()
        }).catch(async (err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message = "error interno del servidor: " + err;
            dataReturn.data = err;
            res.json(dataReturn);
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
};

const onbording_users = (req = request, res = response) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;

            let dataReturn_onbording = [
                // Unir la colección onbording_users con la colección tasks usando $lookup
                {
                    $lookup: {
                        from: 'training.tasks',
                        localField: 'task_id',
                        foreignField: '_id',
                        as: 'task'
                    }
                },
                { $unwind: '$task' },
                // Unir la colección task con la colección employees usando $lookup
                {
                    $lookup: {
                        from: 'hnt.employees',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'employee'
                    }
                },
                { $unwind: '$employee' },
                // Proyectar los campos requeridos
                {
                    $project: {
                        _id: 1,
                        task_id: '$task_id',
                        title: '$task.title',
                        status: 1,
                        priorty: '$task.priority',
                        content: '$task.content',
                        create_date: '$task.create_date',
                        name_employee: '$employee.name',
                        category_id: '$task.category_id',
                        order_task:  '$task.order',
                        active_task: '$task.active',
                        user_id: 1
                    }
                },
                // Agregar la etapa $match para filtrar solo los registros con active_task igual a true
                { $match: { 'active_task': true } }
            ]

            if ( genericFunction.isValidValue(req.query.user_id)) {
                
            let filtro_user_id = { $match: { 'user_id':new ObjectId(req.query.user_id) } };

                dataReturn_onbording.push(filtro_user_id);
            }

            //console.log("Entra");   
            const taskId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
            // Agregar la etapa $match solo si se proporciona un valor para filtrar
            if (genericFunction.isValidValue(taskId)) {
                dataReturn_onbording.push({ $match: { 'category_id': new ObjectId(taskId) } });
            }
            return db.collection('training.onbording_users').aggregate(dataReturn_onbording).toArray();

        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.length > 0) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "consulta correcta";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = dataReturnResult;
            }
            res.json(dataReturn);
            await client.close()
        }).catch(async (err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message = "error interno del servidor: " + err;
            dataReturn.data = err;
            res.json(dataReturn);
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
};

const categories_onbording = (req = request, res = response) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            let dataReturn_onbording = [
                // Unir la colección onbording_users con la colección tasks usando $lookup
                {
                    $lookup: {
                        from: 'training.tasks',
                        localField: 'task_id',
                        foreignField: '_id',
                        as: 'task'
                    }
                },
                { $unwind: '$task' },
                // Unir la colección task con la colección employees usando $lookup
                {
                    $lookup: {
                        from: 'hnt.employees',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'employee'
                    }
                },
                { $unwind: '$employee' },
                // Proyectar los campos requeridos
                {
                    $project: {
                        _id: 1,
                        task_id: '$task_id',
                        status: 1,
                        priorty: '$task.priority',
                        content: '$task.content',
                        create_date: '$task.create_date',
                        name_employee: '$employee.name',
                        user_id: 1,
                        category_id: '$task.category_id'
                    }
                },
            ]
            const user_id = req.params.id; // Obtener el ID del área desde los parámetros de la URL
            // Agregar la etapa $match solo si se proporciona un valor para filtrar
            if (genericFunction.isValidValue(user_id)) {
                dataReturn_onbording.push({ $match: { 'user_id': new ObjectId(user_id) } });
            }
            return db.collection('training.onbording_users').aggregate(dataReturn_onbording).toArray();

        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.length > 0) {
                // Suponiendo que tienes dataReturnResult ya definido
                // Utilizamos un conjunto para garantizar valores únicos
                const uniqueCategoryIds = new Set(dataReturnResult.map(task => task.category_id.toString()));
                // Convertimos el conjunto de nuevo en un array
                const uniqueCategoryIdsArray = [...uniqueCategoryIds].map(id => new ObjectId(id));
                get_categories_onbording_distinct(req, res, uniqueCategoryIdsArray)
            } else {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = dataReturnResult;
                res.json(dataReturn);

            }
            await client.close()
        }).catch(async (err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message = "error interno del servidor: " + err;
            dataReturn.data = err;
            res.json(dataReturn);
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
};

const get_categories_onbording_distinct = (req, res, data_categories) => {
    var db;
    var client;
    connectToDatabase().then((dataReturnDB) => {
        switch (dataReturnDB.valid) {
            case true:
                db = dataReturnDB.data.dataBase;
                client = dataReturnDB.data.dataClient;
                return db.collection('hnt.categories').aggregate([
                    {
                        $match: {
                            _id: { $in: data_categories }
                        }
                    },
                    {
                        $project: {
                            'name': 1,
                            'description': 1,
                            'img_path': 1,
                            'active': 1,
                            'route_icon': 1,
                            'create_date': 1,
                            'update_date': 1
                        }
                    }

                ]).toArray();
            case false:
                res.json(dataReturnDB);
                break;
        }
    }).then(async (dataReturnResult) => {
        if (dataReturnResult.length > 0) {
            dataReturn.valid = true;
            dataReturn.type = "success";
            dataReturn.message = "consulta correcta";
            dataReturn.data = dataReturnResult
        } else {
            dataReturn.valid = true;
            dataReturn.type = "success";
            dataReturn.message = "sin registros encontrados";
            dataReturn.data = dataReturnResult;
        }
        res.json(dataReturn);
        await client.close();

    }).catch((err) => {
        dataReturn.valid = false;
        dataReturn.type = "error";
        dataReturn.message = err.message;
        dataReturn.data = err;
        res.status(400).json(dataReturn);
    });








}

const categories_task = (req = request, res = response) => {

    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;

            let dataReturn = {
                "category_id": "$_id",
                'title': 1,
                'icon_path': 1,
                'content': 1,
                'attachments': 1,
                'expiration_amount': 1,
                'has_expiration': 1,
                'expiration_sequence': 1,
                'category_id': 1,
                'send_notification': 1,
                'segmentation_type': 1,
                'segmentation': 1,
                'autoAssign': 1,
                'type_assignment': 1,
                'from': 1,
                'to': 1,
                'priority': 1,
                'create_date': 1,
                'update_date': 1
            }


            let pipeline = [];
            // Agregar la etapa $project para proyectar los campos deseados
            pipeline.push({ $project: dataReturn });

            console.log(pipeline)

            return db.collection('training.tasks').aggregate(pipeline).toArray();
        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);
            if (dataReturnResult.length > 0) {
                // Suponiendo que tienes dataReturnResult ya definido
                // Utilizamos un conjunto para garantizar valores únicos
                const uniqueCategoryIds = new Set(dataReturnResult.map(task => task.category_id.toString()));
                // Convertimos el conjunto de nuevo en un array
                const uniqueCategoryIdsArray = [...uniqueCategoryIds].map(id => new ObjectId(id));
                get_categories_onbording_distinct(req, res, uniqueCategoryIdsArray)
            } else {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = dataReturnResult;
                res.json(dataReturn);

            }
            await client.close()
        }).catch(async (err) => {
            dataReturn.valid = false;
            dataReturn.type = "error";
            dataReturn.message = "error interno del servidor: " + err;
            dataReturn.data = err;
            res.json(dataReturn);
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
};

const update_task = (req = request, res = response) => {
    try {
        var date_current = new Date(genericFunction.subtractHoursToDate(new Date(), parseInt(process.env.SUBTRACT_HOURS)));
        const taskId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
        var updateData = req.body; // Los datos de actualización se pasan en el cuerpo de la solicitud
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB 
        var segmentation_update;
        var validar_onbording = req.query.validar_onbording;
        var areas;
        var branches;
        var companies;
        var type_collaborators;
        var data_update = [];

        if (Boolean(validar_onbording)) {
            console.log("pendiente");
        } else {

            if (genericFunction.isValidValue(updateData.evaluation_id)) {
                updateData.evaluation_id = new ObjectId(updateData.evaluation_id)
            }

            if (genericFunction.isValidValue(updateData.category_id)) {
                updateData.category_id = new ObjectId(updateData.category_id)
            }
            if (genericFunction.isValidValue(updateData.from)) {
                updateData.from = new Date(updateData.from)
            }
            if (genericFunction.isValidValue(updateData.from)) {
                updateData.to = new Date(updateData.to)
            }
          
            updateData.update_date = date_current;
               
            const segmentation = req.body.segmentation;
            segmentation_update = genericFunction.isValidValue(segmentation);

            if (segmentation_update) {

                if (genericFunction.isValidValue(req.body.segmentation.areas)) {
                    areas = segmentation.areas;
                    areas.forEach((elemento, indice, areas) => {
                        areas[indice] = new ObjectId(elemento);
                    });
                }

                if (genericFunction.isValidValue(req.body.segmentation.branches)) {
                    branches = segmentation.branches;
                    branches.forEach((elemento, indice, branches) => {
                        branches[indice] = new ObjectId(elemento);
                    });
                }

                if (genericFunction.isValidValue(req.body.segmentation.companies)) {
                    companies = segmentation.companies;
                    companies.forEach((elemento, indice, companies) => {
                        companies[indice] = new ObjectId(elemento);
                    });
                }

                if (genericFunction.isValidValue(req.body.segmentation.type_collaborators)) {
                    type_collaborators = segmentation.type_collaborators;
                    type_collaborators.forEach((elemento, indice, type_collaborators) => {
                        type_collaborators[indice] = new ObjectId(elemento);
                    });
                }
            }
            connectToDatabase().then((dataReturnDB) => {
                db = dataReturnDB.data.dataBase;
                client = dataReturnDB.data.dataClient;
                data_update.push( db.collection('training.tasks').updateOne({ _id: new ObjectId(taskId) }, { $set: updateData }));
                if(segmentation_update){
                    data_update.push( db.collection("training.onbording_users").deleteMany({ task_id: new ObjectId(taskId) }));
                }
                return Promise.all(data_update);
            }).then((dataReturnResult) => {              
                var mod_valid = true;
                for (const resultado of dataReturnResult) {
                    mod_valid = resultado.acknowledged;
                    if (!mod_valid) {
                        break;
                    }
                }
                if (mod_valid) {
                    console.log(areas, branches, companies, type_collaborators);
                    let data_task = {insertedId: new ObjectId(taskId) }
                    if(segmentation_update){
                        getUsersSegmentation(req, res, areas, branches, companies, type_collaborators, data_task);
                    }else{
                        dataReturn.valid = true;
                        dataReturn.type = "update";
                        dataReturn.message = "actualización realizada correctamente.";
                        dataReturn.data = dataReturnResult;
                        res.json(dataReturn);
                    }
                  
                } else {
                    dataReturn.valid = false;
                    dataReturn.type = "error";
                    dataReturn.message = "Error al ejecutar operación.";
                    dataReturn.data = dataReturnResult;
                    res.status(400).json(dataReturn);
                }
                client.close();
            }).catch((err) => {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "error interno del servidor: " + err;
                dataReturn.data = err;
                res.status(400).json(dataReturn);
            });
        }

    } catch (err) {
        const dataReturn = {
            valid: false,
            type: "error",
            message: "error interno del servidor: " + err.message,
            data: err
        };
        res.status(400).json(dataReturn);
    }
};






module.exports = {
    insert_task,
    getTasks,
    onbording_users,
    categories_onbording,
    categories_task,
    update_task
};