import { Service } from 'typedi';
import { User, Protocol, Tag, OnBoardingFunnel } from '../../models';
import { AppDataSource } from '../../../loaders/typeormLoader';
import { DuplicateRecordFoundError, NoRecordFoundError } from '../../errors';
import { MESSAGES } from '../../constants/messages';
import { FindManyOptions, In, Like } from 'typeorm';

// Get repositories
const tagRepository = AppDataSource.getRepository(Tag);
const protocolRepository = AppDataSource.getRepository(Protocol);
const userRepository = AppDataSource.getRepository(User);
const onBoardingFunnelRepository = AppDataSource.getRepository(OnBoardingFunnel);

// Service class for User
@Service()
export class UserService {
	constructor() {}

	// Method to create a new user
	public async create(data: User): Promise<User> {
		const userObj = { ...data };

		const userEmailExist = await userRepository.findOneBy({
			email: userObj.email,
		});
		if (userEmailExist) {
			throw new DuplicateRecordFoundError(MESSAGES.USER_EMAIL_EXIST);
		}

		const user = await userRepository.save(userObj);
		return user;
	}

	// Method to list users with optional search parameters
	public async list(searchParams: { userName?: string, email?: string, phone?: string,limit?: number,offset?: number }): Promise<object> {
		const options: FindManyOptions<User> = {
			skip: searchParams.offset,
			take: searchParams.limit,
			where: {},
		};
		
		if (searchParams.userName) {
			options.where = { userName: Like(`%${searchParams.userName}%`) };
		}
		if (searchParams.email) {
			options.where = { email: Like(`%${searchParams.email}%`) };
		}
		if (searchParams.phone) {
			options.where = { phone: Like(`%${searchParams.phone}%`) };
		}
		const [users, count] = await userRepository.findAndCount(options);
		return { count, users };
	}

	// Method to retrieve a user by ID
	public async get(userId: string): Promise<object | null> {
		const user = await userRepository.findOne({
			where: { id: userId },
		});
		if (!user) {
			throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
		}
		const onBoardingFunnels = await this.getOnboardFunnel(userId);
		const userData = { ...user, onBoardingFunnels };
		return userData;
	}

	// Method to update an existing user
	public async update(userId: string, data: Partial<User>): Promise<object> {
		const user = await userRepository.findOneBy({
			id: userId,
		});
		if (!user) {
			throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
		}
		const userNameQuery = userRepository.createQueryBuilder('user')
			.where('user.userName = :userName', { userName: data.userName }).andWhere('user.id != :userId', { userId });
		const userNameExist = await userNameQuery.getOne();
		if (userNameExist) {
			throw new DuplicateRecordFoundError(MESSAGES.USER_NAME_EXIST);
		}
		const userEmailQuery = userRepository.createQueryBuilder('user')
			.where('user.userName = :userName', { userName: data.userName }).andWhere('user.id != :userId', { userId });
		const userEmailExist = await userEmailQuery.getOne();
		if (userEmailExist) {
			throw new DuplicateRecordFoundError(MESSAGES.USER_EMAIL_EXIST);
		}
		Object.assign(user, data);
		await userRepository.save(user);
		return user;
	}

	// Method to delete a user by ID
	public async delete(userId: string): Promise<object> {
		const user = await userRepository.findOneBy({
			id: userId,
		});
		if (!user) {
			throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
		}
		await userRepository.delete(userId);
		return { success: true };
	}

	// Method to save tags for a user
	public async saveTags(userId: string, tagIds: number[]): Promise<User> {
		const user = await userRepository.findOne({ where: { id: userId }, relations: ['tags'] });
		if (!user) {
			throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
		}
		const tags = await tagRepository.find({ where: { id: In(tagIds) } });
		user.tags = tags;
		await userRepository.save(user);
		return user;
	}

	// Method to update tags for a user
	public async updateTags(userId: string, tagIds: number[]): Promise<User> {
		const user = await userRepository.findOne({ where: { id: userId }, relations: ['tags'] });
		if (!user) {
			throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
		}
		const tags = await tagRepository.find({ where: { id: In(tagIds) } });
		user.tags = tags;
		await userRepository.save(user);
		return user;
	}

	// Method to list tags for a user
	public async listTags(userId: string): Promise<User> {
		const user = await userRepository.findOne({ where: { id: userId }, relations: ['tags'] });
		if (!user) {
			throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
		}
		return user;
	}

	// Method to save protocols for a user
	public async saveProtocols(userId: string, protocolIds: number[]): Promise<User> {
		const user = await userRepository.findOne({ where: { id: userId }, relations: ['protocols'] });
		if (!user) {
			throw new NoRecordFoundError('User not found');
		}
		const protocols = await protocolRepository.find({ where: { id: In(protocolIds) } });
		user.protocols = protocols;
		await userRepository.save(user);
		return user;
	}

	// Method to update protocols for a user
	public async updateProtocols(userId: string, protocolIds: number[]): Promise<User> {
		const user = await userRepository.findOne({ where: { id: userId }, relations: ['protocols'] });
		if (!user) {
			throw new NoRecordFoundError('User not found');
		}
		const protocols = await protocolRepository.find({ where: { id: In(protocolIds) } });
		user.protocols = protocols;
		await userRepository.save(user);
		return user;
	}

	// Method to list protocols for a user
	public async listProtocols(userId: string): Promise<User> {
		const user = await userRepository.findOne({ where: { id: userId }, relations: ['protocols'] });
		if (!user) {
			throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
		}
		return user;
	}

	// Method to set an onboarding funnel stage for a user
	public async setOnboardFunnel(userId: string, stage: string, status: string): Promise<OnBoardingFunnel | undefined> {
		const user = await this.get(userId);
		if (user) {
			let onboardingFunnel = await onBoardingFunnelRepository.findOne({
				where: { stage: stage, userId: userId },
			});
			if (onboardingFunnel) {
				onboardingFunnel.status = status;
			} else {
				onboardingFunnel = new OnBoardingFunnel();
				onboardingFunnel.userId = userId;
				onboardingFunnel.stage = stage;
				onboardingFunnel.status = status;
			}
			return await onBoardingFunnelRepository.save(onboardingFunnel);
		}
	}

	// Method to get onboarding funnels for a user
	public async getOnboardFunnel(userId: string): Promise<object> {
		const user = await userRepository.findOne({
			where: { id: userId },
		});
		if (!user) {
			throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
		}
		const onBoardingFunnels = await onBoardingFunnelRepository.find({ where: { userId } });
		const onBoardingFunnel: { [stage: string]: string } = {};
		if (onBoardingFunnels && onBoardingFunnels.length > 0) {
			for (const data of onBoardingFunnels) {
				onBoardingFunnel[data.stage] = data.status;
			}
		}
		return onBoardingFunnel;
	}
}
