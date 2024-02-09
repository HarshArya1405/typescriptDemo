import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import Routes from './routes';
import Database from './config/DB';
import ENV from './config/environments';
import { requestLogger } from './util/request.logger';

export default class Server {
constructor(app: Application) {
  this.config(app);
  this.syncDatabase();
  new Routes(app);
}

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: ENV.whitelistUrls
    };
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(requestLogger);
    
  }

  private syncDatabase(): void {
    const db = new Database();
    db.sequelize?.sync();
  }
}