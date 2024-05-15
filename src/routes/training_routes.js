const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth_middleware');
const trainingMiddleware = require('../middleware/training_middleware');
const trainingController = require('../controllers/training_controller');
const genericFunction = require('../helpers/generic_functions');
const crudController = require('../controllers/crud_controller');
const { ObjectId } = require('mongodb');

// Ruta para insertar una nueva task
router.post('/task', authMiddleware.verifyToken, genericFunction.wrapMiddleware(trainingMiddleware.validate_task, "insert"), (req, res) => {
    trainingController.insert_task(req, res);
});
// Ruta para obtener todas las task
router.get('/task', authMiddleware.verifyToken, (req, res) => {
    trainingController.getTasks(req, res);
});

// Ruta para actualizar task por id
router.put('/task/:id', authMiddleware.verifyToken, genericFunction.wrapMiddleware(trainingMiddleware.validate_task, "update"), (req, res) => {
    trainingController.update_task(req, res);
});

// Ruta para obtener task por id  
router.get('/task/:id', authMiddleware.verifyToken/*, trainingMiddleware.validate_task*/, (req, res) => {
    trainingController.getTasks(req, res);
});

// Ruta para insertar onobrding de usuario
router.get('/onbording_users', authMiddleware.verifyToken, (req, res) => {
    trainingController.onbording_users(req, res);
});

// Ruta para obtener onbording por id
router.get('/onbording_users/:id', authMiddleware.verifyToken, (req, res) => {
    trainingController.onbording_users(req, res);
});

// Ruta para actualizar onbording
router.put('/onbording_users/:id', authMiddleware.verifyToken, (req, res) => {
    let body = req.body;
    let data_operation = { type: "update", name_collection: "training.onbording_users", filter: { _id: new ObjectId(req.params.id) }, query: { $set: body }, dataReplaceObjectId: ["task_id", "user_id"], dataReplaceDateTime: ["expiration", "update_date"], typeReplace: ["ObjectId", "DateTime"] }
    crudController.operation_crud(req, res, data_operation)
});

// Ruta para obtener categorias existentes de onbording
router.get('/categories_onbording/', authMiddleware.verifyToken, (req, res) => {
    trainingController.categories_onbording(req, res);
});

// Ruta para insertar una nueva área
router.get('/categories_onbording/:id', authMiddleware.verifyToken, (req, res) => {
    trainingController.categories_onbording(req, res);
});

// Ruta para insertar una nueva área
router.get('/categories_task/', authMiddleware.verifyToken, (req, res) => {
    trainingController.categories_task(req, res);
});

// Ruta para insertar una nueva área
router.put('/categories_task/', authMiddleware.verifyToken, (req, res) => {
    trainingController.categories_task(req, res);
});

/// insertar evaluations
router.post('/evaluations/', authMiddleware.verifyToken, genericFunction.wrapMiddleware(trainingMiddleware.validate_task_evaluations, "insert"), (req, res) => {
    let data_operation = { type: "insert", name_collection: "training.evaluations", dataReplaceObjectId: ["_id"], typeReplace: ["ObjectId"] }
    crudController.operation_crud(req, res, data_operation)
});

/// consultar evaluations
router.get('/evaluations/', authMiddleware.verifyToken, (req, res) => {
    let data_operation = { type: "read", name_collection: "training.evaluations", query: [{ $match: {} }], typeReplace: [] }
    crudController.operation_crud(req, res, data_operation)
});

/// consultar evaluations por Id
router.get('/evaluations/:id', authMiddleware.verifyToken, (req, res) => {
    let data_operation = { type: "read", name_collection: "training.evaluations", query: [{ $match: { _id: new ObjectId(req.params.id) } }], typeReplace: [] }
    crudController.operation_crud(req, res, data_operation)
});

/// actualizar evaluations por Id
router.put('/evaluations/:id', authMiddleware.verifyToken, (req, res) => {
    let date_current = new Date(genericFunction.subtractHoursToDate(new Date(), parseInt(process.env.SUBTRACT_HOURS)));
    let body = req.body;
    body.update_date = date_current;
    let data_operation = { type: "update", name_collection: "training.evaluations", filter: { _id: new ObjectId(req.params.id) }, query: { $set: body }, dataReplaceObjectId: ["_id"], typeReplace: ["ObjectId"] }
    crudController.operation_crud(req, res, data_operation)
});

/// eliminar evaluations por Id
router.delete('/evaluations/:id', authMiddleware.verifyToken, trainingMiddleware.validate_task_evaluations_delete, (req, res) => {
    let data_operation = { type: "delete", name_collection: "training.evaluations", query: { _id: new ObjectId(req.params.id) }, typeReplace: [] }
    crudController.operation_crud(req, res, data_operation)
});

/// insertar evaluations_answers
router.post('/evaluations_answers/', authMiddleware.verifyToken, genericFunction.wrapMiddleware(trainingMiddleware.validate_task_evaluations_answers, "insert"), (req, res) => {
    let data_operation = { type: "insert", name_collection: "training.evaluations_answers", dataReplaceObjectId: ["_id", "evaluation_id", "question_id", "user_id"], typeReplace: ["ObjectId"] }
    crudController.operation_crud(req, res, data_operation)
});

/// consultar evaluations_answers
router.get('/evaluations_answers/', authMiddleware.verifyToken, (req, res) => {
    let data_operation = { type: "read", name_collection: "training.evaluations_answers", query: [{ $match: {} }], typeReplace: [] }
    crudController.operation_crud(req, res, data_operation)
});

/// consultar evaluations_answers por id
router.get('/evaluations_answers/:id', authMiddleware.verifyToken, (req, res) => {
    let data_operation = { type: "read", name_collection: "training.evaluations_answers", query: [{ $match: { _id: new ObjectId(req.params.id) } }], typeReplace: [] }
    crudController.operation_crud(req, res, data_operation)
});

module.exports = router;