import { auth } from 'express-openid-connect';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import ENV from '../config/environments';
import logger from '../util/logger';


export const auth0Loader: MicroframeworkLoader = (settings?: MicroframeworkSettings) => {
  const app = settings?.getData('express_app');

  if (app) {
    const config = {
      authRequired: false,
      auth0Logout: true,
      baseURL: ENV.baseAppURL,
      clientID: ENV.Auth0.clientID,
      issuerBaseURL: ENV.Auth0.issuerBaseURL,
      secret: ENV.Auth0.secret
    };
    app.use(auth(config));

  } else {
    logger.error('Express app not found in settings');
  }
};
