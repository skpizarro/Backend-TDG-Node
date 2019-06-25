const aws = require('aws-sdk');
const path = require("path");

var configPath = path.join(process.cwd(), '../app/config');
if (process.env.NODE_ENV === 'production') {
    configPath = path.join(process.cwd(), './app/config');
}
const config = require(configPath);

const S3_BUCKET = config.bucket;
const S3_REGION = config.region; //us-east-1
const S3_ACCESS_KEY = config.access_key;
const S3_SECRET_ACCESS_KEY = config.secret_access_key;

aws.config.update({
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    accessKeyId: S3_ACCESS_KEY,
    region: S3_REGION
});

const s3 = new aws.S3();

const uploadQR = function(fileName, qrResult) {
    console.log(`-> QR to aws`);

    let params = {
        Bucket: S3_BUCKET,
        Key: fileName + '.png',
        Body: qrResult,
        ContentType: 'image/png',
        ACL: 'public-read'
    };

    s3.putObject(params, function(err, qrResult) {
        if (err) {
            console.log(`Error uploading QR: ${err}`);
        }
        console.log('- QR upload success');
        console.log(qrResult);
    });
}

module.exports = {
    uploadQR
}