const cors = require('cors');
//const { Client } = require('pg');
//const plugins = require('../plugins');
const config = require('../config');
const express = require('express');
const router = express.Router();

var bodyParser = require('body-parser');
router.use(bodyParser.json());

router.use(cors());

var customers = require('../controllers/customerController');
var solicitudes = require('../controllers/solicitudController');

// Aprobar solicitud ... que recibo en REQ[idQR?]
// [idQR]=>(almacenar.data.bd)(enviar.email.usr) 
router.post('/api/aprobar', solicitudes.aprobar);

/*/ Retrieve all solicitudes
// enviar datos de todas las solicitudes al front...
router.get('/api/solicitudes', solicitudes.findAll);

// Retrieve a single Customer by Id
// enviar datos de una sola solicitud
router.get('/api/solicitudes/:id', solicitudes.findOne);

// Delete a Customer with Id
// true or false
router.delete('/api/solicitudes/:id', solicitudes.delete);
*/

// Create a new Customer
router.post('/api/customers', customers.create);

// Retrieve all Customer
router.get('/api/customers', customers.findAll);

// Retrieve a single Customer by Id
router.get('/api/customers/:id', customers.findOne);

// Update a Customer with Id
router.put('/api/customers/:id', customers.update);

// Delete a Customer with Id
router.delete('/api/customers/:id', customers.delete);

//const POSTGRES_URI = config.db_uri;

/*
/api/customers – GET all customers
/api/customers/:id – GET a customer by Id
/api/customers – POST a customer
/api/customers/update/:id – UPDATE a customer by Id
/api/customers/delete/:id – DELETE a customer by Id
*/

module.exports = router;