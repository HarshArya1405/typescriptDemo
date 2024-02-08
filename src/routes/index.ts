import { Application } from "express";
import taskRoutes from "./task.router";

export default class Routes {
  constructor(app: Application) {
    app.use("/api", taskRoutes);
  }
}