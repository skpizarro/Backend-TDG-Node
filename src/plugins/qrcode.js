const router = require("../router/router");
const bodyParser = require("body-parser");
const qr = require('qr-image');
const ejs = require('ejs')
const fs = require('fs');

// const app = express();
// Set view engine
// app.set('view engine', 'ejs')
// Set static folder
router.use(express.static('./public'))
router.use(bodyParser.urlencoded({ extended: true}));