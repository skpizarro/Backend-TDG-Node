const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
 
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cors());

var clienteController = require('../controllers/clienteController');
var homeController = require('../controllers/homeController');

//home
router.get('/api/hello', homeController.helloApi);
//login
router.post('/api/login', homeController.loginAdmin);
//formulario // se carga el tipo de usuarios
router.get('/api/Formulario',homeController.formulario);

//Formulario/Fecha   // se carga las zonas segun disponibilidad por fecha
router.get('/api/Formulario/Fecha',homeController.zonasxFechaForm);

// Se valida la informacion del qr segun la zona en la que se solicite.
router.post('/api/validateqr', clienteController.validateRequest);


router.post('/api/SolicitudIngreso',clienteController.createRequest);

module.exports = router;
/**
 *  bodyParser.urlencoded(): analiza el texto como datos codificados en URL 
 * (enviar datos de formularios normales establecidos a POST) 
 * y expone el objeto resultante (con las claves y los valores) en req.body.
 * 
 *  bodyParser.json(): Analiza el texto como JSON 
 * y expone el objeto resultante en req.body.
 */