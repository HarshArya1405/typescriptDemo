interface CorsConfig {
    whitelistUrls: string[];
}

const corsConfig: CorsConfig = {
    whitelistUrls: [
        '*',
        'http://localhost:3000',
        'https://localhost:3000'
    ]
};

export default corsConfig;
