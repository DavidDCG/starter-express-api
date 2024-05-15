const express = require('express');
const router = express.Router();
const catalogsController = require('../controllers/catalogs_controller');
const catalogsMiddleware = require('../middleware/catalogs_middleware');
const authMiddleware = require('../middleware/auth_middleware');

// Ruta para consultar
router.get('/areas',authMiddleware.verifyToken, (req, res) => {
    catalogsController.get_areas(req, res);
});
// Ruta para insertar una nueva área
router.post('/areas', authMiddleware.verifyToken,catalogsMiddleware.insert_area, (req, res) => {
    catalogsController.insert_area(req, res);
});
// Ruta para eliminar un área por ID
router.delete('/areas/:id',  authMiddleware.verifyToken, catalogsMiddleware.validate_area_exists, (req, res) => {  
    catalogsController.delete_area(req, res);
});
// Ruta para actualizar un área por ID
router.put('/areas/:id',  authMiddleware.verifyToken, catalogsMiddleware.validate_area_exists,catalogsMiddleware.update_area, (req, res) => {   
    catalogsController.update_area(req, res);
});


// Ruta para consultar
router.get('/branches',authMiddleware.verifyToken, (req, res) => {
    catalogsController.get_branch(req, res);
});
// Ruta para insertar una nueva sucursal
router.post('/branches', authMiddleware.verifyToken,catalogsMiddleware.insert_branch, (req, res) => {
    catalogsController.insert_branch(req, res);
});
// Ruta para eliminar un área por ID
router.delete('/branches/:id',  authMiddleware.verifyToken, catalogsMiddleware.validate_branch_exists, (req, res) => {  
    catalogsController.delete_branch(req, res);
});
// Ruta para actualizar un área por ID
router.put('/branches/:id',  authMiddleware.verifyToken, catalogsMiddleware.validate_branch_exists,catalogsMiddleware.update_branch, (req, res) => {   
    catalogsController.update_branch(req, res);
});

router.get('/companies',authMiddleware.verifyToken, (req, res) => {
    catalogsController.get_companies(req, res);
});


// Ruta para insertar una nueva área
router.post('/companies', authMiddleware.verifyToken,catalogsMiddleware.insert_company, (req, res) => {
    catalogsController.insert_company(req, res);
});

// Ruta para eliminar un área por ID
router.delete('/companies/:id',  authMiddleware.verifyToken, catalogsMiddleware.validate_company_exists, (req, res) => {  
    catalogsController.delete_company(req, res);
});

// Ruta para actualizar un área por ID
router.put('/companies/:id',  authMiddleware.verifyToken, catalogsMiddleware.validate_company_exists, (req, res) => {   
   // catalogsController.update_company(req, res);
});


// Ruta para consultar
router.get('/categories',authMiddleware.verifyToken, (req, res) => {
    catalogsController.get_categories(req, res);
});

router.post('/categories', authMiddleware.verifyToken,catalogsMiddleware.insert_category, (req, res) => {
    catalogsController.insert_category(req, res);
});

router.put('/categories/:id',authMiddleware.verifyToken, catalogsMiddleware.update_category, (req, res) => {
    catalogsController.update_category(req, res);
});
router.delete('/categories/:id',authMiddleware.verifyToken, (req, res) => {
    catalogsController.delete_category(req, res);
});


module.exports = router;