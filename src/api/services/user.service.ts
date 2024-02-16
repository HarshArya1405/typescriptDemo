import { Op } from 'sequelize';

import { Service } from 'typedi';

import { User } from '../models/user.model';
import { AppDataSource } from '../../loaders/typeormLoader';
import { DuplicateRecordFoundError } from '../errors';

const userRepository = AppDataSource.getRepository(User);
@Service()
export class UserService {
	constructor(
		// @OrmRepository() private petRepository: UserRepository,
	) { }


	public async create(data: User): Promise<User> {
		const userObj  = {...data};
		const user = await userRepository.save(userObj);
		return user;
	}

	public async list(searchParams: { userName?: string,email?: string, phone?: string}): Promise<User[]> {
		interface SearchParams {
			userName?: string;
			email?: string;
			phone?: string;
		}
		type Condition = {
			[key in keyof SearchParams]?: key extends 'userName' ?  { [Op.like]: string } : string;
		};

		const condition: Condition = {};
		if (searchParams.userName) {
			condition.userName = { [Op.like]: `%${searchParams.userName}%` };
		}
		if (searchParams.email) {
			condition.email = searchParams.email;
		}
		if (searchParams.phone) {
			condition.phone = searchParams.phone;
		}
		const users = await userRepository.find();
		return users;
	}

	public async get(userId: number): Promise<User | null> {
		const user = await userRepository.findOneBy({
			id: userId,
		});
		return (user) ? user : null;	
	}

	public async update(userId: number,data: User): Promise<object> {
		const user = await userRepository.findOneBy({
			id: userId,
		});
		//checking userName unique - 
		const query = userRepository.createQueryBuilder('user')
  		.where('user.userName = :userName', { userName: data.userName }).andWhere('user.id != :userId', { userId });
		

		const userNameExist = await query.getOne();
		if(userNameExist) {
			throw new DuplicateRecordFoundError('DuplicateRecordFoundError');
		}
		if(user){
			const userObj  = {user, ...data};
			await userRepository.save(userObj);
			return { success: true };
		}
		return { error: '404' };
	}

	public async delete(userId: number): Promise<object> {
		const task = await userRepository.findOneBy({
			id: userId,
		});
		if(task){
			await userRepository.remove(task);
			return { success: true };
		}
		return { error: '404' };
	}
}
