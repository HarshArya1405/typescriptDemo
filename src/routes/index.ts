import { Application } from 'express';
import taskRoutes from './task.router';
import authenticationRouter from './authentication.router';

export default class Routes {
  constructor(app: Application) {
    app.use('api', taskRoutes);
    app.use('/api', authenticationRouter);
  }
}