const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const cors = require('cors');
 
router.use(bodyParser.json());
router.use(cors());

var solicitudes = require('../controllers/solicitudController');

//create => generateQR

//Antes de enviar los datos con las solicitudes debemos enviar todas las zonas para luego comparar con las solicitadas
router.get('/api/Zonas',solicitudes.getZonas);

//Retrieve all solicitudes
// enviar datos de todas las solicitudes al front...
router.get('/api/solicitudes', solicitudes.findAll);

// Retrieve a single solicitud by [Id]
// enviar datos de una sola solicitud
router.get('/api/solicitudes/:id', solicitudes.findOne);

// Update a solicitud with [Id]
router.put('/api/solicitudes/:id', solicitudes.update);

//Rechazar una solicitud
router.put('/api/solicitudes', solicitudes.deny);

module.exports = router;