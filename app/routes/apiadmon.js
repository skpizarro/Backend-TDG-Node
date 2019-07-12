const express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
const cors = require('cors');

router.use(bodyParser.json());
router.use(cors());

var solicitudes = require('../controllers/solicitudController');

// Aprobar solicitud ... que recibo en REQ[idQR?]
// [idQR]=>(almacenar.data.bd)(enviar.email.usr) 
router.post('/api/solicitudes', solicitudes.approve);

//Retrieve all solicitudes
// enviar datos de todas las solicitudes al front...
router.get('/api/solicitudes', solicitudes.findAll);

// Retrieve a single solicitud by [Id]
// enviar datos de una sola solicitud
router.get('/api/solicitudes/:id', solicitudes.findOne);

// Update a solicitud with [Id]
router.put('/api/solicitudes/:id', solicitudes.update);

// Delete a solicitud with [Id]
// true or false
router.delete('/api/solicitudes/:id', solicitudes.delete);

module.exports = router;