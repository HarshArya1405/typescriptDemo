// Importing necessary modules and packages
import express, { Application } from 'express';
import ENV from './src/config/environments';
import Server from './src/app';
import logger from './src/util/logger'; 
import dotenv from 'dotenv';
dotenv.config(); // Loading environment variables from .env file into process.env

// Creating an instance of the Express application
const app: Application = express();

// Initializing the Server class with the Express application instance
new Server(app);

// Parsing the port number from environment variables
const PORT: number = parseInt(ENV.servicePort, 10);

// Starting the Express server to listen on the specified port
app
  .listen(PORT, ENV.baseAppURL, function () {
    logger.info(`Server is running on port ${PORT}.`); // Logging server startup message
  })
  // Handling server startup errors
  .on('error', (err: Error) => {
    // Checking if the error is due to address already in use
    if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
      logger.error('Error: address already in use'); // Logging address already in use error
    } else {
      logger.error(err); // Logging other server startup errors
    }
  });  
