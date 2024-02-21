import { Op } from 'sequelize';

import { Service } from 'typedi';

import { Task } from '../models/task.model';
import { AppDataSource } from '../../loaders/typeormLoader';

const taskRepository = AppDataSource.getRepository(Task);
@Service()
export class TaskService {
	constructor(
		// @OrmRepository() private petRepository: TaskRepository,
	) { }


	public async create(data: Task): Promise<Task> {
		const task = new Task();
		task.title = data.title;
		task.description = data.description;
		task.published = data.published;
		await taskRepository.save(task);
		return task;
	}

	public async list(searchParams: { title?: string, published?: boolean }): Promise<object> {
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
		const [tasks, count] = await taskRepository.findAndCount();

		return { count, tasks };
	}

	public async get(taskId: number): Promise<Task | null> {
		const task = await taskRepository.findOneBy({
			id: taskId,
		});
		return (task) ? task : null;	
	}

	public async update(taskId: number,data: Task): Promise<object> {
		const task = await taskRepository.findOneBy({
			id: taskId,
		});
		if(task){
			const taskObj  = {task, ...data};
			await taskRepository.save(taskObj);
			return { success: true };
		}
		return { error: '404' };
	}

	public async delete(taskId: number): Promise<object> {
		const task = await taskRepository.findOneBy({
			id: taskId,
		});
		if(task){
			await taskRepository.remove(task);
			return { success: true };
		}
		return { error: '404' };
	}
}
