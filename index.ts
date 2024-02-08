
import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import taskRouter from './modules/task/router/task.router';
import Routes from "./config/route";
import Database from "./config/DB/index";

export default class Server {
  constructor(app: Application) {
    this.config(app);
    this.syncDatabase();
    new Routes(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "http://localhost:8081"
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }

  private syncDatabase(): void {
    const db = new Database();
    db.sequelize?.sync();
  }
}



















// const app:express.Application = express();
// app.use(express.json({ limit: '50mb' }));
// app.use(taskRouter);

// const hostName : string = '127.0.0.1'
// const port :number = 5000;

// app.listen(port,hostName,()=>{
//     console.log(`Node server is up and running at - http://${hostName}:${port}`);
// }); 
