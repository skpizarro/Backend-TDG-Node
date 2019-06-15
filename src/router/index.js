"use strict";

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(`---PETICION--- \n${req.hostname} ~ ${req.body}\n<< ${req.ip} >>`);
    res.send({ express: "HOME PAGE" });
});

module.exports = router;