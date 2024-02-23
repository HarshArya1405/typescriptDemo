import { Op } from 'sequelize';

import { Service } from 'typedi';

import { User } from '../models/user.model';
import { AppDataSource } from '../../loaders/typeormLoader';
import { DuplicateRecordFoundError, NoRecordFoundError } from '../errors';
import { In } from 'typeorm';
import { Tag } from '../models/tag.model';
import { Protocol } from '../models/protocol.model';

const userRepository = AppDataSource.getRepository(User);
const tagRepository = AppDataSource.getRepository(Tag);
const protocolRepository = AppDataSource.getRepository(Protocol);

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

	public async saveUserTags(userId: number, tagIds: number[]): Promise<User> {
		const user = await userRepository.findOne({ where: { id: userId }, relations: ['tags'] });
		if (!user) {
			throw new NoRecordFoundError('User not found');
		}

		const tags = await tagRepository.find({ where: { id: In(tagIds) } });

		user.tags = tags;
		await userRepository.save(user);

		return user;
	}

	public async updateUserTags(userId: number, tagIds: number[]): Promise<User> {
		const user = await userRepository.findOne({ where: { id: userId }, relations: ['tags'] });
		if (!user) {
		  throw new NoRecordFoundError('User not found');
		}
	  
		const tags = await tagRepository.find({ where: { id: In(tagIds) } });
	  
		user.tags = tags;
		await userRepository.save(user);
	  
		return user;
	  }

	  public async listUserTags(userId: number, offset: number, limit: number, nameFilter?: string): Promise<{ tags: Tag[], count: number }> {
		try {
			const user = await userRepository.findOne({ 
				where: { id: userId }, 
				relations: ['tags'],
			});
			if (!user) {
				throw new NoRecordFoundError('User not found');
			}
			let userTags = user.tags;
			if (nameFilter) {
				userTags = userTags.filter(tag => tag.name.includes(nameFilter));
			}
			const totalCount = userTags.length;
			userTags = userTags.slice(offset, offset + limit);
			return { tags: userTags, count: totalCount };
		} catch (error) {
			console.error('Error listing user tags:', error);
			throw error;
		}
	}	
	  
	  public async saveUserProtocols(userId: number, protocolIds: number[]): Promise<User> {
		const user = await userRepository.findOne({ where: { id: userId }, relations: ['protocols'] });
		if (!user) {
			throw new NoRecordFoundError('User not found');
		}

		const protocols = await protocolRepository.find({ where: { id: In(protocolIds) } });

		user.protocols = protocols;
		await userRepository.save(user);

		return user;
	}

	public async updateUserProtocols(userId: number, protocolIds: number[]): Promise<User> {
		const user = await userRepository.findOne({ where: { id: userId }, relations: ['protocols'] });
		if (!user) {
		  throw new NoRecordFoundError('User not found');
		}
	  
		const protocols = await protocolRepository.find({ where: { id: In(protocolIds) } });
	  
		user.protocols = protocols;
		await userRepository.save(user);
	  
		return user;
	  }

	  public async listUserProtocols(userId: number, offset: number, limit: number, nameFilter?: string, categoryFilter?: string): Promise<{ protocols: Protocol[], count: number }> {
		try {
			const user = await userRepository.findOne({ 
				where: { id: userId }, 
				relations: ['protocols'],
			});
			if (!user) {
				throw new NoRecordFoundError('User not found');
			}
			let userProtocols = user.protocols;
			if (nameFilter) {
				userProtocols = userProtocols.filter(protocol => protocol.name.includes(nameFilter));
			}
			if (categoryFilter) {
				userProtocols = userProtocols.filter(protocol => protocol.category === categoryFilter);
			}
			const totalCount = userProtocols.length;
			userProtocols = userProtocols.slice(offset, offset + limit);
			return { protocols: userProtocols, count: totalCount };
		} catch (error) {
			console.error('Error listing user protocols:', error);
			throw error;
		}
	}	
}
