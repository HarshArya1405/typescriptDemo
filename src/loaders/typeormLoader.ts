import { DataSource } from 'typeorm';
import logger from '../util/logger';
import ENV from '../config/environments';

// Define a DataSource instance for the application
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: ENV.postgres.HOST,
    port: parseInt(ENV.postgres.PORT),
    username: ENV.postgres.USER,
    password: ENV.postgres.PASSWORD,
    database: ENV.postgres.DB,
    synchronize: true,
    entities: ['src/api/models/index.ts'],
    logging: true,
    subscribers: [],
    migrations: ['src/api/migrations/*.ts']
});

// Initialize the DataSource and handle any errors
AppDataSource.initialize().then(() => {
    logger.info('Database connection established');
}).catch((error) => {
    logger.error(error);
});
