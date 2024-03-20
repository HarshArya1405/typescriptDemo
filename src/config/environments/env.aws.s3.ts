interface S3Config {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    version: string;
    bucket: string;
}

const s3Config: S3Config = {
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
    region: process.env.S3_REGION || '',
    version: process.env.S3_VERSION || '',
    bucket: process.env.S3_BUCKET || ''
};

const s3PublicConfig: S3Config = {
    accessKeyId: process.env.S3_PUBLIC_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_PUBLIC_SECRET_KEY || '',
    region: process.env.S3_PUBLIC_REGION || '',
    version: process.env.S3_PUBLIC_VERSION || '',
    bucket: process.env.S3_PUBLIC_BUCKET || ''
};

export default {
    s3: {s3Config, s3PublicConfig}
};  