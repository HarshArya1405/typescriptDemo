import { Application } from "express";
import taskRoutes from "../../modules/task/router/task.router";

export default class Routes {
  constructor(app: Application) {
    app.use("/api", taskRoutes);
  }
}