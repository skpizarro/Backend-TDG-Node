const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
 
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cors());

var adminController = require('../controllers/adminController');

router.post('/admin/crud', adminController.create);

router.get('/admin/crud', adminController.findAll);

router.get('/admin/crud/:id', adminController.findOne);

router.put('/admin/crud', adminController.update);

router.delete('/admin/crud/:id', adminController.delete); 

module.exports = router;