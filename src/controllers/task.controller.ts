import {TaskService} from "../services";
const taskService = new TaskService();
import { Request, Response } from 'express';

export default class TaskController{
    async create(req:Request,res:Response):Promise<void>{
        try {
            const data = await taskService.create(req.body);
            res.send(data)
        } catch (error) {
            console.error(`tasks: save: error - ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
    }
    async get(req:Request,res:Response):Promise<void>{
        try {
            const data = await taskService.get(parseInt(req.params.id));
            res.send(data)
        } catch (error) {
            console.error(`tasks: get: error - ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
    };

    async list(req:Request,res:Response):Promise<void>{
        try {
            const data = await taskService.list(req.query);
            res.send(data)
        } catch (error) {
            console.error(`tasks: get: error - ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
    };
    async update(req:Request,res:Response):Promise<void>{
        try {
            const data = await taskService.update(req.body,parseInt(req.params.id));
            res.send(data)
        } catch (error) {
            console.error(`tasks: get: error - ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
    };
    async delete(req:Request,res:Response):Promise<void>{
        try {
            const data = await taskService.delete(parseInt(req.params.id));
            res.send({data})
        } catch (error) {
            console.error(`tasks: get: error - ${JSON.stringify(error, null, 2)}`);
            throw error;
        }
    };

}
