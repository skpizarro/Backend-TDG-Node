const express = require('express');
const router = express.Router();
const cors= require('cors');
const bodyParser = require('body-parser');
 
router.use(bodyParser.json());
router.use(cors());

var visitas = require('../controllers/visitasController')

router.get('/api/Visitas/:zona',visitas.getVisitas);


module.exports = router;