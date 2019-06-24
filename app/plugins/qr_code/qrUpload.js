const aws = require('aws-sdk');

const S3_BUCKET = process.env.S3_BUCKET || 'qr-storage-poli';
const S3_REGION = process.env.S3_REGION || 'sa-east-1'; //us-east-1
const S3_ACCESS_KEY = process.env.S3_ACCESS_KEY || 'AKIAJP7QNYF5WYGDL4OA';
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || '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';

aws.config.update({
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    accessKeyId: S3_ACCESS_KEY,
    region: S3_REGION
});

const s3 = new aws.S3();

const uploadQR = function(fileName, qrResult) {

    console.log('-->>uploading QR');

    let params = {
        Bucket: S3_BUCKET,
        Key: fileName + '.png',
        Body: qrResult,
        ContentType: 'image/png',
        // ContentType: 'image/svg+xml',
        ACL: 'public-read'
    };

    s3.putObject(params, function(err, qrResult) {
        if (err) {
            console.log(`Error uploading QR: ${err}`);
        }
        console.log('Successfully QR uploaded');
        console.log(qrResult);
    });

}

module.exports = {
    uploadQR
}