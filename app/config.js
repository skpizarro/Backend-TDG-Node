const dotenv = require("dotenv");

// read in the .env file
dotenv.config();

// capture the environment variables the application needs
const {
    MAIL_PASS,
    MAIL_USER,
    POSTGRES_DB,
    POSTGRES_HOST,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_URI,
    S3_ACCESS_KEY,
    S3_BUCKET,
    S3_REGION,
    S3_SECRET_ACCESS_KEY
} = process.env;

module.exports = {
    mail_user: MAIL_USER,
    mail_password: MAIL_PASS,
    db_server: POSTGRES_HOST,
    db_name: POSTGRES_DB,
    db_user: POSTGRES_USER,
    db_password: POSTGRES_PASSWORD,
    db_uri: POSTGRES_URI,
    access_key: S3_ACCESS_KEY,
    bucket: S3_BUCKET,
    region: S3_REGION,
    secret_access_key: S3_SECRET_ACCESS_KEY
};