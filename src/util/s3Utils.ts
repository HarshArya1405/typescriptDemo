import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import ENV from '../config/environments';

const accessKeyId = ENV.s3.s3Config.accessKeyId;
const secretAccessKey = ENV.s3.s3Config.secretAccessKey;
const version = ENV.s3.s3Config.version;
const region = ENV.s3.s3Config.region;
const bucket = ENV.s3.s3Config.bucket;

//TODO:move to ext config
const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    useAccelerateEndpoint: true,
    signatureVersion: version,
    region: region
});

const signedUrlExpireSeconds = 60 * 60;

const myBucket = bucket;

async function getSignedUrlForUpload(data: {fileType: string }): Promise<{ success: boolean, message: string, path: string, urls: string }> {

    const myKey = 'valu' + '/' + uuidv4() + data.fileType.replace(/^\.?/, '.');
    const params = {
        Bucket: myBucket,
        Key: myKey,
        Expires: signedUrlExpireSeconds
    };
    return new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', params, function (err, url) {
            if (err) {
                console.log('Error getting presigned url from AWS S3', err);
                reject({ success: false, message: 'Pre-Signed URL error', urls: url });
            } else {
                resolve({
                    success: true,
                    message: 'AWS SDK S3 Pre-signed urls generated successfully.',
                    path: myKey,
                    urls: url
                });
            }
        });
    });

}

async function getSignedUrlForRead(data: { path: string }): Promise<{ success: boolean, message: string, url: string }> {

    let myKey = data.path;
    const trimValue = 'https://api-images-prod.s3.amazonaws.com/';
    if (myKey) {
        myKey = myKey.replace(trimValue, '');
    }
    const params = {
        Bucket: myBucket,
        Key: myKey,
        Expires: signedUrlExpireSeconds
    };
    return new Promise((resolve, reject) => {
        s3.getSignedUrl('getObject', params, function (err, url) {
            if (err) {
                reject({ success: false, message: 'Pre-Signed URL error', urls: url });
            } else {
                resolve({ success: true, message: 'AWS SDK S3 Pre-signed urls generated successfully.', url: url });
            }
        });
    });

}

async function getFileAsStream(data: { path: string }): Promise<Buffer> {
    async function getBufferFromS3Promise(file: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            getBufferFromS3(file, (error, s3buffer) => {
                if (error) {
                    return reject(error);
                } else if (s3buffer) {
                    return resolve(s3buffer);
                }
            });
        });
    }

    function getBufferFromS3(file: string, callback: (error: Error | null, buffer?: Buffer) => void) {
        const myKey = file;
        const buffers: Buffer[] = [];
        const options = {
            Bucket: myBucket,
            Key: myKey,
        };
        const stream = s3.getObject(options).createReadStream();
        stream.on('data', data => buffers.push(data));
        stream.on('end', () => callback(null, Buffer.concat(buffers)));
        stream.on('error', error => callback(error));
    }

    const myKey = data.path;
    const buffer = await getBufferFromS3Promise(myKey);
    return buffer;

}

export { getSignedUrlForUpload, getSignedUrlForRead, getFileAsStream };