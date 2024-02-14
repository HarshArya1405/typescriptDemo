import { DataSource } from 'typeorm';
import { Task } from '../api/models/task.model';
import ENV from '../config/environments';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: ENV.postgres.HOST,
    port: parseInt(ENV.postgres.PORT),
    username: ENV.postgres.USER,
    password: ENV.postgres.PASSWORD,
    database: ENV.postgres.DB,
    synchronize: true,
    entities: [
      Task
    ],
    logging: true,
    subscribers: [],
    migrations: [],
  });
  
  // to initialize the initial connection with the database, register all entities
  // and 'synchronize' database schema, call 'initialize()' method of a newly created database
  // once in your application bootstrap
  AppDataSource.initialize()
      .then(() => {
          // here you can start to work with your database
      })
      .catch((error) => console.log(error));
  