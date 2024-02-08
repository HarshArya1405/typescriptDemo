import { Task } from '../models';
import { Op } from 'sequelize';
import logger from '../util/logger';

interface ITaskService {
    create(task: Task): Promise<Task>;
    list(searchParams: { title: string, published: boolean }): Promise<Task[]>;
    get(taskId: number): Promise<Task | null>;
    update(task: Task, taskId: number): Promise<object>;
    delete(taskId: number): Promise<object>;
}

class TaskService implements ITaskService {
	constructor() { }

	async create(task: Task): Promise<Task> {
		try {
			console.log({ task });

			return await Task.create({
				title: task.title,
				description: task.description,
				published: task.published
			});
		} catch (err) {
			throw new Error('Failed to create Task!');
		}
	}

	async list(searchParams: { title?: string, published?: boolean }): Promise<Task[]> {
		try {
            interface SearchParams {
                title?: string;
                published?: boolean;
            }
            type Condition = {
                [key in keyof SearchParams]?: key extends 'title' ? { [Op.like]: string } : boolean;
            };

            const condition: Condition = {};
            logger.info('INFO - Failed to retrieve Tasks!');
            logger.warn('WARN - Failed to retrieve Tasks!');
            logger.error('ERROR - Failed to retrieve Tasks!');
            if (searchParams.published !== undefined) {
            	condition.published = searchParams.published;
            }
            if (searchParams.title) {
            	condition.title = { [Op.like]: `%${searchParams.title}%` };
            }
            return await Task.findAll({ where: condition });
		} catch (error) {
			throw new Error('Failed to retrieve Tasks!');
		}
	}

	async get(taskId: number): Promise<Task | null> {
		try {
			return await Task.findByPk(taskId);
		} catch (error) {
			throw new Error('Failed to retrieve Tasks!');
		}
	}

	async update(task: Task, taskId: number): Promise<object> {
		const { title, description, published } = task;

		try {
			const affectedRows = await Task.update(
				{ title, description, published },
				{ where: { id: taskId } }
			);
			console.log({ affectedRow: affectedRows[0] });

			return { success: true };
		} catch (error) {
			throw new Error('Failed to update Task!');
		}
	}

	async delete(taskId: number): Promise<object> {
		try {
			await Task.destroy({ where: { id: taskId } });
			return { success: true };
		} catch (error) {
			throw new Error('Failed to delete Task!');
		}
	}
}

export default TaskService;