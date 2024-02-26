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
			const queryBuilder = userRepository.createQueryBuilder('user')
				.leftJoinAndSelect('user.tags', 'tag')
				.where('user.id = :userId', { userId });
	
			// Apply name filter if provided
			if (nameFilter) {
				queryBuilder.andWhere('tag.name LIKE :nameFilter', { nameFilter: `%${nameFilter}%` });
			}
	
			// Count total number of tags without applying limit and offset
			const totalCount = await queryBuilder.getCount();
	
			// Retrieve paginated user tags
			const users = await queryBuilder
				.skip(offset)
				.take(limit)
				.getMany();
	
			// Map user entities to their associated tags
			const userTags: Tag[] = users.reduce((tags: Tag[], user) => {
				tags.push(...user.tags);
				return tags;
			}, []);
	
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
			const queryBuilder = userRepository.createQueryBuilder('user')
				.leftJoinAndSelect('user.protocols', 'protocol')
				.where('user.id = :userId', { userId });
	
			// Apply name filter if provided
			if (nameFilter) {
				queryBuilder.andWhere('protocol.name LIKE :nameFilter', { nameFilter: `%${nameFilter}%` });
			}
	
			// Apply category filter if provided
			if (categoryFilter) {
				queryBuilder.andWhere('protocol.category = :categoryFilter', { categoryFilter });
			}
	
			// Count total number of protocols without applying limit and offset
			const totalCount = await queryBuilder.getCount();
	
			// Retrieve paginated user protocols
			const user = await queryBuilder
				.skip(offset)
				.take(limit)
				.getOneOrFail();
	
			const userProtocols: Protocol[] = user.protocols;
	
			return { protocols: userProtocols, count: totalCount };
		} catch (error) {
			console.error('Error listing user protocols:', error);
			throw error;
		}
	}	
}
