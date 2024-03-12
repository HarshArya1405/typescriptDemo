interface YTConfig {
    YTConfig?:{
        client_id?: string;
        project_id?: string;
        auth_uri?: string;
        token_uri?:string;
        auth_provider_x509_cert_url?: string;
        client_secret?: string;
        api_key?: string;
        redirect_uris: string[];
        javascript_origins: string[];
    }
}

const ytConfig: YTConfig = {
    YTConfig:{
        client_id: process.env.YT_WEB_CLIENT_ID,
        project_id: process.env.YT_WEB_PROJECT_ID ,
        auth_uri: process.env.YT_WEB_AUTH_URI ,
        token_uri: process.env.YT_WEB_TOKEN_URI ,
        api_key: process.env.YT_WEB_API_KEY ,
        auth_provider_x509_cert_url: process.env.YT_WEB_AUTH_PROVIDER_X509_CERT_URL,
        client_secret: process.env.YT_WEB_client_secret ,
        redirect_uris: [
          'http://localhost:3000/onboard/creator/connectYoutube',
          'https://localhost:3000/onboard/creator/connectYoutube',
          'http://localhost:3000',
          'https://localhost:3000',
          'http://localhost',
          'https://localhost'
        ],
        javascript_origins: [
          'http://localhost:3000',
          'https://localhost:3000',
          'http://localhost',
          'https://localhost'
        ]
    }

};

export default ytConfig;
