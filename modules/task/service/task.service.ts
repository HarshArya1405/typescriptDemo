import Task from "../model/task.model";
import { Op } from "sequelize";

interface ITaskService {
    create(task: Task): Promise<Task>;
    list(searchParams: { title: string, published: boolean }): Promise<Task[]>;
    get(taskId: number): Promise<Task | null>;
    update(task: Task,taskId: number): Promise<object>;
    delete(taskId: number): Promise<object>;
}

class TaskService implements ITaskService {
    constructor() { }

    async create(task: Task): Promise<Task> {
        try {
            console.log({task});
            
            return await Task.create({
                title: task.title,
                description: task.description,
                published: task.published
            });
        } catch (err) {
            throw new Error("Failed to create Task!");
        }
    }

    async list(searchParams: { title?: string, published?: boolean }): Promise<Task[]> {
        try {
            let condition: any = {};

            if (searchParams?.published) condition.published = true;

            if (searchParams?.title)
                condition.title = { [Op.like]: `%${searchParams.title}%` };

            return await Task.findAll({ where: condition });
        } catch (error) {
            throw new Error("Failed to retrieve Tasks!");
        }
    }

    async get(taskId: number): Promise<Task | null> {
        try {
            return await Task.findByPk(taskId);
        } catch (error) {
            throw new Error("Failed to retrieve Tasks!");
        }
    }

    async update(task: Task,taskId: number): Promise<object> {
        const { title, description, published } = task;

        try {
            const affectedRows = await Task.update(
                { title, description, published },
                { where: { id: taskId } }
            );
            console.log({affectedRow:affectedRows[0]});
            
            return {success:true};
        } catch (error) {
            throw new Error("Failed to update Task!");
        }
    }

    async delete(taskId: number): Promise<object> {
        try {
            const affectedRows = await Task.destroy({ where: { id: taskId } });

            return {success:true};
        } catch (error) {
            throw new Error("Failed to delete Task!");
        }
    }
}

export default TaskService;