const aws = require('aws-sdk');
const config = require('../../config');

const S3_ACCESS_KEY = config.access_key;
const S3_BUCKET = config.bucket;
const S3_REGION = config.region;
const S3_SECRET_ACCESS_KEY = config.secret_access_key;

aws.config.update({
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    accessKeyId: S3_ACCESS_KEY,
    region: S3_REGION
});

const s3 = new aws.S3();

const uploadQR = function(fileName, qrResult) {
    console.log(`-> QR to aws >>bucket:${S3_BUCKET}`);

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
        console.log('-QR uploaded- ' + JSON.stringify(qrResult));
    });
}

module.exports = {
    uploadQR
};