
import express from 'express';
import taskRouter from './modules/task/router/task.router';

const app:express.Application = express();
app.use(express.json({ limit: '50mb' }));
app.use(taskRouter);

const hostName : string = '127.0.0.1'
const port :number = 5000;

app.listen(port,hostName,()=>{
    console.log(`Node server is up and running at - http://${hostName}:${port}`);
});