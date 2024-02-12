import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import Routes from './routes';
import Database from './config/DB';
import ENV from './config/environments';
import { requestLogger } from './util/request.logger';

export default class Server {
  // Constructor function to initialize the Server class
  constructor(app: Application) {
    this.config(app); // Configuring the Express application
    this.syncDatabase(); // Synchronizing the database
    new Routes(app); // Initializing routes
  }

  // Function to configure the Express application
  private config(app: Application): void {
    // Cors options for handling Cross-Origin Resource Sharing (CORS)
    const corsOptions: CorsOptions = {
      origin: ENV.whitelistUrls // Whitelist URLs for CORS
    };
    app.use(cors(corsOptions)); // Using CORS middleware
    app.use(express.json()); // Parsing incoming JSON requests
    app.use(express.urlencoded({ extended: true })); // Parsing URL-encoded requests
    app.use(requestLogger); // Logging incoming requests
  }

  // Function to synchronize the database
  private syncDatabase(): void {
    const db = new Database(); // Creating a new Database instance
    db.sequelize?.sync(); // Synchronizing the database
  }
}
