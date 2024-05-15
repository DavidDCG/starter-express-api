const { connectToDatabase } = require('../../config/db');
const { dataReturn } = require('../helpers/constants');
const { ObjectId } = require('mongodb');
const genericFunction = require('../helpers/generic_functions');
require('dotenv').config();



const get_areas = (req = request, res = response) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.areas').aggregate([
                {
                    $lookup: {
                        from: "hnt.companies",
                        localField: "company_id",
                        foreignField: "_id",
                        as: "company_data"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        cvecia: 1,
                        code_area: 1,
                        name: 1,
                        company_data: 1,
                        create_date: 1,
                        update_date: 1
                    }
                }

            ]).toArray();

        }).then((dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.length > 0) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "consulta correcta";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "success";
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = [];
            }
            res.json(dataReturn);
            client.close();
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

const insert_area = (req = request, res = response) => {
    try {

        let date_current = new Date(genericFunction.subtractHoursToDate(new Date(), parseInt(process.env.SUBTRACT_HOURS)));
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        let data_area = req.body;
        data_area.create_date = date_current;
        data_area.update_date = date_current;

        data_area.company_id = new ObjectId(data_area.company_id)
        console.log(data_area);
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.areas').insertOne(data_area);

        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "El area se insertó correctamente.";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al insertar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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

const delete_area = (req = request, res = response) => {
    try {
        const areaId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB    
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.areas').deleteOne({ _id: new ObjectId(areaId) });
        }).then(async (dataReturnResult) => {
            // console.log(dataReturnResult);
            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "delete";
                dataReturn.message = "se eliminó correctamente";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al eliminar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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

const update_area = (req = request, res = response) => {
    try {

        let date_current = new Date(genericFunction.subtractHoursToDate(new Date(), parseInt(process.env.SUBTRACT_HOURS)));


        const areaId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
        const updateData = req.body; // Los datos de actualización se pasan en el cuerpo de la solicitud
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB 

        if (genericFunction.isValidValue(updateData.company_id)) {
            updateData.company_id = new ObjectId(updateData.company_id)
        }

        updateData.update_date = date_current;

        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.areas').updateOne({ _id: new ObjectId(areaId) }, { $set: updateData });
        }).then(async (dataReturnResult) => {
            // console.log(dataReturnResult);
            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "update";
                dataReturn.message = "se actualizó correctamente";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al eliminar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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
////
const get_branch = (req = request, res = response) => {
    try {

        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.branches').aggregate([

                {
                    $lookup: {
                        from: "hnt.companies",
                        localField: "company_id",
                        foreignField: "_id",
                        as: "company_data"
                    }
                },

                {
                    $project: {
                        _id: 1,
                        cvecia: 1,
                        company_data: 1,
                        create_date: 1,
                        update_date: 1,
                        code_branch: 1,
                        name: 1

                    }
                }

            ]).toArray();


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
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = [];
            }
            res.json(dataReturn);
            await client.close();
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

const insert_branch = (req = request, res = response) => {
    try {

        let date_current = new Date(genericFunction.subtractHoursToDate(new Date(), parseInt(process.env.SUBTRACT_HOURS)));


        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB


        req.body.create_date = date_current;
        req.body.update_date = date_current;
        req.body.company_id = new ObjectId(req.body.company_id)
        console.log(req.body);
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.branches').insertOne(req.body);

        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "la sucursal se insertó correctamente.";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al insertar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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

const delete_branch = (req = request, res = response) => {
    try {
        const areaId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB    
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.branches').deleteOne({ _id: new ObjectId(areaId) });
        }).then((dataReturnResult) => {
            // console.log(dataReturnResult);
            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "delete";
                dataReturn.message = "se eliminó correctamente";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al eliminar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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

const update_branch = (req = request, res = response) => {
    try {

        let date_current = new Date(genericFunction.subtractHoursToDate(new Date(), parseInt(process.env.SUBTRACT_HOURS)));


        const areaId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
        const updateData = req.body; // Los datos de actualización se pasan en el cuerpo de la solicitud
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB 

        if (genericFunction.isValidValue(updateData.company_id)) {
            updateData.company_id = new ObjectId(updateData.company_id)
        }

        updateData.update_date = date_current;

        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.branches').updateOne({ _id: new ObjectId(areaId) }, { $set: updateData });
        }).then(async (dataReturnResult) => {
            // console.log(dataReturnResult);
            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "update";
                dataReturn.message = "se actualizó correctamente";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al eliminar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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

const get_companies = (req = request, res = response) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.companies').aggregate([
                {
                    $project: {
                        _id: 1,
                        cvecia: 1,
                        company_id: 1,
                        create_date: 1,
                        update_date: 1,
                        code_branch: 1,
                        name: 1
                    }
                }

            ]).toArray();

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
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = [];
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

const insert_company = (req = request, res = response) => {
    try {

        let date_current = new Date(genericFunction.subtractHoursToDate(new Date(), parseInt(process.env.SUBTRACT_HOURS)));


        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        req.body.create_date = date_current;
        req.body.update_date = date_current;
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.companies').insertOne(req.body);
        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "la compania se insertó correctamente.";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al insertar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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

const delete_company = (req = request, res = response) => {
    try {
        const areaId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB    
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.companies').deleteOne({ _id: new ObjectId(areaId) });
        }).then((dataReturnResult) => {
            // console.log(dataReturnResult);
            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "delete";
                dataReturn.message = "se eliminó correctamente";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al eliminar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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

const update_company = (req = request, res = response) => {
    try {

        let date_current = new Date(genericFunction.subtractHoursToDate(new Date(), parseInt(process.env.SUBTRACT_HOURS)));

        const updateData = req.body; // Los datos de actualización se pasan en el cuerpo de la solicitud
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB 

        if (genericFunction.isValidValue(updateData.company_id)) {
            updateData.company_id = new ObjectId(updateData.company_id)
        }

        updateData.update_date = date_current;

        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.companies').updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });
        }).then(async (dataReturnResult) => {
            // console.log(dataReturnResult);
            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "update";
                dataReturn.message = "se actualizó correctamente";
                dataReturn.data = dataReturnResult
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al eliminar";
                dataReturn.data = dataReturnResult
            }
            res.json(dataReturn);
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

const get_categories = (req = request, res = response) => {
    try {
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;

            var data_Return = [];

            data_Return.push(db.collection('hnt.categories').aggregate([
                {
                    $match: { active: true } // Filtrar categorías activas
                },
                {
                    $project: {
                        'name': 1,
                        'description': 1,
                        'img_path': 1,
                        'active': 1,
                        'route_icon': 1,
                        'create_date': 1,
                        'update_date': 1,
                        'order': 1
                    }
                }

            ]).toArray())

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
                        user_id: 1,
                        title: '$task.title',
                        status: 1,
                        priorty: '$task.priority',
                        content: '$task.content',
                        create_date: '$task.create_date',
                        name_employee: '$employee.name',
                        category_id: '$task.category_id',
                        active_task: '$task.active'
                    }
                },
                // Agregar la etapa $match para filtrar solo los registros con active_task igual a true
                { $match: { 'active_task': true } }
            ]


            if ( genericFunction.isValidValue(req.query.user_id)) {
                
                let filtro_user_id = { $match: { 'user_id':new ObjectId(req.query.user_id) } };
    
                    dataReturn_onbording.push(filtro_user_id);
                }

            data_Return.push(db.collection('training.onbording_users').aggregate(dataReturn_onbording).toArray())

            return Promise.all(data_Return);

        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);

            let categories = dataReturnResult[0];
            let onboardingUsers = dataReturnResult[1];

            const Categories = categories.map(category => {
                let categoria_id = category._id.toString();
                //  console.log(categoria_id.toString());
                const countNotStarted = onboardingUsers.filter(user => user.status == 'Not Started' && user.category_id == categoria_id).length;
                const countStarted = onboardingUsers.filter(user => user.status == 'In Progress' && user.category_id == categoria_id).length;
                const countComplete = onboardingUsers.filter(user => user.status == 'Completed' && user.category_id == categoria_id).length;
                return {
                    ...category,
                    count_not_started: countNotStarted,
                    count_started: countStarted,
                    count_complete: countComplete
                };
            });

            if (dataReturnResult.length > 0) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "consulta correcta";
                dataReturn.data = Categories
            } else {
                dataReturn.valid = false;
                dataReturn.type = "success";
                dataReturn.message = "sin registros encontrados";
                dataReturn.data = [];
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

const insert_category = (req = request, res = response) => {
    try {
        let date_current = new Date(genericFunction.subtractHoursToDate(new Date(), parseInt(process.env.SUBTRACT_HOURS)));

        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB
        req.body.create_date = date_current;
        req.body.update_date = date_current;
        req.body.active = true;

        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.categories').insertOne(req.body);
        }).then(async (dataReturnResult) => {

            console.log(dataReturnResult);

            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "success";
                dataReturn.message = "la categoría se insertó correctamente.";
                dataReturn.data = dataReturnResult
                res.json(dataReturn);

            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "Error al insertar";
                dataReturn.data = dataReturnResult
                res.status(400).json(dataReturn);
            }

            await client.close();
        }).catch((err) => {
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
        res.status(400).json(dataReturn);
    }
};
const update_category = (req = request, res = response) => {
    try {
        let date_current = new Date(genericFunction.subtractHoursToDate(new Date(), parseInt(process.env.SUBTRACT_HOURS)));
        const categoryId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
        const updateData = req.body; // Los datos de actualización se pasan en el cuerpo de la solicitud
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB 

        updateData.update_date = date_current;

        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.categories').updateOne({ _id: new ObjectId(categoryId) }, { $set: updateData });
        }).then(async (dataReturnResult) => {
            // console.log(dataReturnResult);
            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "update";
                dataReturn.message = "se actualizó correctamente";
                dataReturn.data = dataReturnResult
                res.json(dataReturn);
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "error al eliminar";
                dataReturn.data = dataReturnResult
                res.status(400).json(dataReturn);
            }

            await client.close();
        }).catch((err) => {
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
        res.status(400).json(dataReturn);
    }
};
const delete_category = (req = request, res = response) => {
    try {
        const categoryId = req.params.id; // Obtener el ID del área desde los parámetros de la URL
        var client; // Variable para almacenar el cliente de MongoDB
        var db; // Variable para almacenar el cliente de MongoDB    
        connectToDatabase().then((dataReturnDB) => {
            db = dataReturnDB.data.dataBase;
            client = dataReturnDB.data.dataClient;
            return db.collection('hnt.categories').deleteOne({ _id: new ObjectId(categoryId) });
        }).then(async (dataReturnResult) => {
            // console.log(dataReturnResult);
            if (dataReturnResult.acknowledged) {
                dataReturn.valid = true;
                dataReturn.type = "delete";
                dataReturn.message = "se eliminó correctamente";
                dataReturn.data = dataReturnResult;
                res.json(dataReturn);
            } else {
                dataReturn.valid = false;
                dataReturn.type = "error";
                dataReturn.message = "error al eliminar";
                dataReturn.data = dataReturnResult;
                res.status(400).json(dataReturn);
            }
            await client.close();
        }).catch((err) => {
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
        res.status(400).json(dataReturn);
    }
};

module.exports = {
    ////////
    get_areas,
    insert_area,
    delete_area,
    update_area,
    //////////
    get_branch,
    insert_branch,
    delete_branch,
    update_branch,
    ///////////
    get_companies,
    insert_company,
    delete_company,
    update_company,
    /////////////
    get_categories,
    insert_category,
    update_category,
    delete_category
};