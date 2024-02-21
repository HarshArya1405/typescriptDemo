import 'reflect-metadata'; 
// Importing necessary modules and packages
import { createExpressServer } from 'routing-controllers';
import { TaskController } from './src/api/controllers/task.controller';
import { TagController } from './src/api/controllers/tag.controller';
import ENV from './src/config/environments';
import Server from './src/app';
import './src/loaders/typeormLoader';

import logger from './src/util/logger'; 
import dotenv from 'dotenv';
import { ProtocolController } from './src/api/controllers/protocol.controller';
dotenv.config(); 

const app = createExpressServer({
  controllers: [TaskController, ProtocolController, TagController], // Register the TaskController
});

new Server(app);
// Start the server
const PORT = ENV.servicePort || 8080;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
}).on('error', (err: Error) => {
  // Checking if the error is due to address already in use
  if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
    logger.error('Error: address already in use'); // Logging address already in use error
  } else {
    logger.error(err); // Logging other server startup errors
  }
});  
