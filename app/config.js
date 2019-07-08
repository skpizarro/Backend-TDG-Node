const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    mail_password: process.env.MAIL_PASS,
    mail_user: process.env.MAIL_USER,
    db_name: process.env.POSTGRES_DB,
    db_server: process.env.POSTGRES_HOST,
    db_user: process.env.POSTGRES_USER,
    db_password: process.env.POSTGRES_PASSWORD,
    db_uri: process.env.POSTGRES_URI,
    access_key: process.env.S3_ACCESS_KEY,
    bucket: process.env.S3_BUCKET,
    region: process.env.S3_REGION,
    secret_access_key: process.env.S3_SECRET_ACCESS_KEY
};