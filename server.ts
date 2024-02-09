import express, { Application } from 'express';
import dotenv from 'dotenv';
import logger from './src/util/logger';
dotenv.config(); 
import ENV from './src/config/environments';
import Server from './src/app';

const app: Application = express();
new Server(app);
const PORT: number = parseInt(ENV.servicePort, 10);

app
  .listen(PORT, ENV.baseAppURL, function () {
    logger.info(`Server is running on port ${PORT}.`);
  })
  .on('error', (err: Error) => {
    if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
      logger.error('Error: address already in use');
    } else {
      logger.error(err);
    }
  });