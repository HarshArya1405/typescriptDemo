interface BaseConfig {
    appNamespace: string;
    servicePort: string;
    jwtSecret?: string;
    jwtForResetPasswordSecret?: string;
    mmi?: {
        secret?: string;
        id?: string;
        apiKey?: string;
    };
}

const baseConfig: BaseConfig = {
    appNamespace: process.env.BASE_APP_NAMESPACE ?? 'auth',
    servicePort: process.env.BASE_APP_PORT ?? '3008',
    jwtSecret: process.env.AUTH_ACCESS_JWT_SECRET,
    jwtForResetPasswordSecret: process.env.AUTH_ACCESS_JWT_SECRET_RESET_PASSWORD,
    mmi: {
        secret: process.env.MMI_CLIENT_SECRET,
        id: process.env.MMI_CLIENT_ID,
        apiKey: process.env.MMI_ADVANCE_API_KEY
    }
};

export default baseConfig;
