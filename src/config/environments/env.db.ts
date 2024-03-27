interface DBConfig {
    postgres:{
        HOST?: string;
        USER?: string;
        PASSWORD?: string;
        DB?: string;
        PORT: string;
        DIALECT : string
    }
}
const dbConfig : DBConfig = {
    postgres: {
        HOST: process.env.DB_HOST ?? 'localhost',
        USER: process.env.DB_USER ?? 'postgres',
        PASSWORD: process.env.DB_PASSWORD ?? 'Tirtha@4321',
        DB: process.env.DB_NAME ?? 'testdb',
        PORT: process.env.DB_PORT ?? '5432',
        DIALECT: process.env.DB_DIALECT ?? 'postgres'
    }
};

export default dbConfig;