import express, { Router } from 'express';
import TaskController from '../controllers/task.controller';

const taskController = new TaskController();

const taskRouter: Router = express.Router();

taskRouter.post('/task/create', taskController.create);
taskRouter.get('/task/:id', taskController.get);
taskRouter.put('/task/:id', taskController.update);
taskRouter.delete('/task/:id', taskController.delete);
taskRouter.get('/tasks', taskController.list);
taskRouter.get('/tasks/list', taskController.list);

export default taskRouter;
