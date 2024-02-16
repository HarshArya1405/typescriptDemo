import { MicroframeworkLoader } from 'microframework-w3tec';
import logger from '../util/logger';


export const baseLoader: MicroframeworkLoader = () => {
  logger.info('BaseLoader');
  // other configs
};