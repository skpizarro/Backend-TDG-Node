const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cors());

var clienteController = require('../controllers/clienteController');

router.get('/api/hello', clienteController.helloApi);

router.get('/api/validateqr/:id', clienteController.validateRequest);

router.post('/api/generateqr', clienteController.createRequest);

module.exports = router;
/**
 *  bodyParser.urlencoded(): analiza el texto como datos codificados en URL 
 * (enviar datos de formularios normales establecidos a POST) 
 * y expone el objeto resultante (con las claves y los valores) en req.body.
 * 
 *  bodyParser.json(): Analiza el texto como JSON 
 * y expone el objeto resultante en req.body.
 */