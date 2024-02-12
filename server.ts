import 'reflect-metadata'; 
// Importing necessary modules and packages
import { createExpressServer } from 'routing-controllers';
import { TaskController } from './src/api/controllers/task.controller';
import ENV from './src/config/environments';
import Server from './src/app';
import logger from './src/util/logger'; 
import dotenv from 'dotenv';
dotenv.config(); 


const app = createExpressServer({
  controllers: [TaskController], // Register the TaskController
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
