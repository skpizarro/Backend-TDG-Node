const dotenv = require("dotenv");

// read in the .env file
dotenv.config();

// capture the environment variables the application needs
const {
    S3_BUCKET,
    S3_REGION,
    S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY,
    MAIL_USER,
    MAIL_PASS,
    SQL_SERVER,
    SQL_DATABASE,
    SQL_USER,
    SQL_PASSWORD,
    SQL_ENCRYPT
} = process.env;

module.exports = {
    bucket: S3_BUCKET,
    region: S3_REGION,
    access_key: S3_ACCESS_KEY,
    secret_access_key: S3_SECRET_ACCESS_KEY,
    mail_user: MAIL_USER,
    mail_password: MAIL_PASS,
    db_server: SQL_SERVER,
    db_name: SQL_DATABASE,
    db_user: SQL_USER,
    db_password: SQL_PASSWORD,
    db_encrypt: SQL_ENCRYPT
};