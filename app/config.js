const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    mail_password: process.env.MAIL_PASS,
    mail_user: process.env.MAIL_USER,
    db_uri: process.env.DATABASE_URL,
};