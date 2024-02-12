import { Op } from 'sequelize';

import { Service } from 'typedi';
// import { OrmRepository } from 'typeorm-typedi-extensions';

// import { Logger, LoggerInterface } from '../../decorators/Logger';
import { Task } from '../models';
// import { TaskRepository } from '../repositories/TaskRepository';
// import { events } from '../subscribers/events';

@Service()
export class TaskService {
	constructor(
		// @OrmRepository() private petRepository: TaskRepository,
	) { }


	public async create(task: Task): Promise<Task> {
		const savedTask = await Task.create({
			title: task.title,
			description: task.description,
			published: task.published
		});

		return savedTask.toJSON();
	}

	public async list(searchParams: { title?: string, published?: boolean }): Promise<Task[]> {
		interface SearchParams {
			title?: string;
			published?: boolean;
		}
		type Condition = {
			[key in keyof SearchParams]?: key extends 'title' ? { [Op.like]: string } : boolean;
		};

		const condition: Condition = {};
		if (searchParams.published !== undefined) {
			condition.published = searchParams.published;
		}
		if (searchParams.title) {
			condition.title = { [Op.like]: `%${searchParams.title}%` };
		}
		const tasks = await Task.findAll({ where: condition });
		return tasks.map(task => task.toJSON());
	}

	public async get(taskId: number): Promise<Task | null> {
		const task = await Task.findByPk(taskId);
		return (task) ? task.toJSON() : null;
	}

	public async update(taskId: number,task: Task): Promise<object> {
		const { title, description, published } = task;
		const taskExist = await this.get(taskId);
		if(taskExist){
			await Task.update(
				{ title, description, published },
				{ where: { id: taskId } }
			);
			return { success: true };
		}
		return { error: '404' };
	}

	public async delete(taskId: number): Promise<object> {
		await Task.destroy({ where: { id: taskId } });
		return { success: true };
	}
}
