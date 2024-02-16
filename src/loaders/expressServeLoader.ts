import { MicroframeworkLoader,MicroframeworkSettings } from 'microframework-w3tec';
import ENV from '../config/environments';
import logger from '../util/logger';
import { Request, Response } from 'express';
export const expressServeLoader: MicroframeworkLoader = (settings?: MicroframeworkSettings) => {
  const app = settings?.getData('express_app');

  if (app) {
    const PORT = ENV.servicePort || 8080;
    app.get('/', (req:Request, res:Response) => {
      res.send(
        req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'
      );
    });
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
  } else {
    logger.error('Express app not found in settings');
  }
};
