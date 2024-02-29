import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config(); 
import './src/loaders/typeormLoader';
import { bootstrapMicroframework, MicroframeworkBootstrapConfig } from 'microframework-w3tec';
import { expressInitLoader,auth0Loader,baseLoader, expressServeLoader} from './src/loaders';
import logger from './src/util/logger';

const config: MicroframeworkBootstrapConfig = {
  loaders: [
    baseLoader,
    expressInitLoader,
    auth0Loader,
    expressServeLoader,
    // Add any other loaders you need here
  ],
  // Other configuration options can be added here
};

bootstrapMicroframework(config)
  .then(() => logger.info('Application is up and running.'))
  .catch(error => logger.error('Application is crashed: ' + error));
