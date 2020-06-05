const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    mail_password: process.env.MAIL_PASS,
    mail_user: process.env.MAIL_USER,
    db_name: process.env.POSTGRES_DB,
    db_server: process.env.POSTGRES_HOST,
    db_user: process.env.POSTGRES_USER,
    db_password: process.env.POSTGRES_PASSWORD

};