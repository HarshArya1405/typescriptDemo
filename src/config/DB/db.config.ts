import ENV from '../environments';
import { Dialect } from 'sequelize/types';

export const config = {
    HOST: ENV.postgres.HOST,
    USER: ENV.postgres.USER,
    PASSWORD: ENV.postgres.PASSWORD,
    DB: ENV.postgres.DB,
    POOL: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  };
  export const dialect: Dialect = ENV.postgres.DIALECT as Dialect;