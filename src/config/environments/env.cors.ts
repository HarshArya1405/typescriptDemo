interface CorsConfig {
    whitelistUrls: string[];
    methods: string[];
}

const corsConfig: CorsConfig = {
    whitelistUrls: [
        '*',
        // 'http://localhost:3000',
    ],
    methods: ['GET','POST','PUT','DELETE','PATCH', 'OPTIONS']
};

export default corsConfig;
