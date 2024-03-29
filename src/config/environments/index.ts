import baseConfig from './env.base';
import corsConfig from './env.cors';
import dbConfig from './env.db';
import mailConfig from './env.email';
import s3Config from './env.aws.s3';
import auth0Config from './env.auth0';

const mergedEnvironmentConfig = {
    ...baseConfig,
    ...corsConfig,
    ...dbConfig,
    ...mailConfig,
    ...s3Config,
    ...auth0Config
};

Object.freeze(mergedEnvironmentConfig);
export default mergedEnvironmentConfig;
