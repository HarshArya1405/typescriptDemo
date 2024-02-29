import { auth } from 'express-openid-connect';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import ENV from '../config/environments';
import logger from '../util/logger';

// Define a loader for configuring authentication using Auth0
export const auth0Loader: MicroframeworkLoader = (settings?: MicroframeworkSettings) => {
  // Retrieve the Express app from Microframework settings
  const app = settings?.getData('express_app');

  if (app) {
    // Configuration for Auth0 authentication
    const config = {
      authRequired: false, // Specify if authentication is required for all routes
      auth0Logout: true,   // Enable Auth0 logout
      baseURL: ENV.baseAppURL,               // Base URL of the application
      clientID: ENV.Auth0.clientID,          // Client ID for Auth0 application
      issuerBaseURL: ENV.Auth0.issuerBaseURL, // Issuer Base URL for Auth0
      secret: ENV.Auth0.secret                // Secret key for Auth0
    };
    // Use Auth0 middleware for authentication
    app.use(auth(config));
  } else {
    // Log error if Express app is not found in settings
    logger.error('Express app not found in settings');
  }
};
