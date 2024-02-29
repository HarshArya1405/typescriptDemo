import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import ENV from '../config/environments';
import logger from '../util/logger';
import { Request, Response } from 'express';

// Define a loader for serving Express app
export const expressServeLoader: MicroframeworkLoader = (settings?: MicroframeworkSettings) => {
  // Retrieve the Express app from Microframework settings
  const app = settings?.getData('express_app');

  if (app) {
    // Define the port for the server to listen on
    const PORT = ENV.servicePort || 8080;
    
    // Define a route handler for the root URL
    app.get('/', (req: Request, res: Response) => {
      // Send a response based on user authentication status
      res.send(
        req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
      );
    });

    // Start the server and listen on the specified port
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    }).on('error', (err: Error) => {
      // Handle server startup errors
      if (err instanceof Error && (err as NodeJS.ErrnoException).code === 'EADDRINUSE') {
        logger.error('Error: address already in use'); // Log address already in use error
      } else {
        logger.error(err); // Log other server startup errors
      }
    });
  } else {
    logger.error('Express app not found in settings');
  }
};
