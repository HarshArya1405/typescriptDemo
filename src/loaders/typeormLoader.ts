import { DataSource } from 'typeorm';
import { Task,User,Role } from '../api/models';
import logger from '../util/logger';
import ENV from '../config/environments';
import { Tag } from '../api/models/tag.model';
import { Protocol } from '../api/models/protocol.model';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: ENV.postgres.HOST,
    port: parseInt(ENV.postgres.PORT),
    username: ENV.postgres.USER,
    password: ENV.postgres.PASSWORD,
    database: ENV.postgres.DB,
    synchronize: false,
    entities: [Role,Task, Tag, Protocol,User],
    logging: false,
    subscribers: [],
    migrations: ['src/api/migrations/*.ts']
  });
  
  // to initialize the initial connection with the database, register all entities
  // and 'synchronize' database schema, call 'initialize()' method of a newly created database
  // once in your application bootstrap
  AppDataSource.initialize().then(() => {
          // here you can start to work with your database
      })
      .catch((error) => logger.error(error));
  







// import { DataSource } from 'typeorm';
// import { Task, User } from '../api/models';
// import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
// import ENV from '../config/environments';

// // Declare AppDataSource
// let AppDataSource: DataSource;

// export const typeormLoader: MicroframeworkLoader = async (settings?: MicroframeworkSettings) => {
//   try {
//     // Initialize AppDataSource
//     AppDataSource = new DataSource({
//       type: 'postgres',
//       host: ENV.postgres.HOST,
//       port: parseInt(ENV.postgres.PORT),
//       username: ENV.postgres.USER,
//       password: ENV.postgres.PASSWORD,
//       database: ENV.postgres.DB,
//       synchronize: true,
//       entities: [
//         Task, User
//       ],
//       logging: true,
//       subscribers: [],
//       migrations: [],
//     });

//     // Initialize the AppDataSource
//     await AppDataSource.initialize();
//     console.log('Database connection established');
//   } catch (error) {
//     console.error('Error initializing database connection:', error);
//   }
// };

// // Export AppDataSource for use in other files
// export { AppDataSource };