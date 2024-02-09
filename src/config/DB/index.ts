import { Sequelize } from 'sequelize-typescript';
import { config,dialect} from './db.config';
import {Task} from '../../models';
import logger from '../../util/logger';

class Database {
  public sequelize: Sequelize | undefined;

  constructor() {
    this.connectToDatabase();
  }

  private async connectToDatabase() {
    this.sequelize = new Sequelize({
      database: config.DB,
      username: config.USER,
      password: config.PASSWORD,
      host: config.HOST,
      dialect: dialect,
      pool: {
        max: config.POOL.max,
        min: config.POOL.min,
        acquire: config.POOL.acquire,
        idle: config.POOL.idle
      },
      models: [Task],
      logging: (sql: string) => {
        logger.info(`Executing query: ${sql}`);
    }
    });

    await this.sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch((err) => {
        console.error('Unable to connect to the Database:', err);
      });
  }
}

export default Database;