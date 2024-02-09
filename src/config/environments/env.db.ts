interface DBConfig {
    postgres:{
        HOST?: string;
        USER?: string;
        PASSWORD?: string;
        DB?: string;
        pool:{
            max?:number ,
            min?:number ,
            acquire?:number ,
            idle?:number 
        }
    }
}
const dbConfig : DBConfig = {
    postgres: {
        HOST: process.env.DB_HOST ?? 'localhost',
        USER: process.env.DB_USER ?? 'postgres',
        PASSWORD: process.env.DB_PASSWORD ?? 'postgres',
        DB: process.env.DB_NAME ?? 'testdb',
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
    }
};

export default dbConfig;