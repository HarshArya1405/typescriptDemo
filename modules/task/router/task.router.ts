import express, { Router } from 'express';
import TaskController from '../controller/task.controller';

const taskController = new TaskController();

const taskRouter: Router = express.Router();

taskRouter.post('/task/create', taskController.create);
taskRouter.get('/task/:id', taskController.get);
taskRouter.get('/tasks', taskController.list);

export default taskRouter;