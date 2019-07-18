const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const cors = require('cors');
 
router.use(bodyParser.json());
router.use(cors());

var aprobadas = require('../controllers/aprobadaController');

//create => approve

// Aprobar solicitud ... que recibo en REQ[idQR?]
// [idQR]=>(almacenar.data.bd)(enviar.email.usr) 
router.post('/api/adm/approve', aprobadas.approve);

//Retrieve all solicitudes
// enviar datos de todas las solicitudes al front...
router.get('/api/adm/aprobadas', aprobadas.findAll);

// Retrieve a single solicitud by [Id]
// enviar datos de una sola solicitud
router.get('/api/adm/aprobadas/:id', aprobadas.findOne);

// Update a solicitud with [Id]
router.put('/api/adm/aprobadas/:id', aprobadas.update);

// Delete a solicitud with [Id]
// true or false
router.delete('/api/adm/aprobadas/:id', aprobadas.delete);

module.exports = router;