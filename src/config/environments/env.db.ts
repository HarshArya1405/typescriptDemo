interface DBConfig {
    postgres:{
        HOST?: string;
        USER?: string;
        PASSWORD?: string;
        DB?: string;
        DIALECT : string
    }
}
const dbConfig : DBConfig = {
    postgres: {
        HOST: process.env.DB_HOST ?? 'localhost',
        USER: process.env.DB_USER ?? 'postgres',
        PASSWORD: process.env.DB_PASSWORD ?? 'postgres',
        DB: process.env.DB_NAME ?? 'testdb',
        DIALECT: process.env.DB_DIALECT ?? 'postgres'
    }
};

export default dbConfig;