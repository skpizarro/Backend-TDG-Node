"use strict";

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(`>GET /home \n>${req.hostname}\n>${req.ip}`);
    res.send({ api_access_control: "HOME PAGE" });
});

module.exports = router;