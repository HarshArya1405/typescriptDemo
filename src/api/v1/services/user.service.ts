import { Service } from 'typedi';
import { User, Protocol, Tag, OnBoardingFunnel, SocialHandle, Wallet } from '../../models';
import { AppDataSource } from '../../../loaders/typeormLoader';
import { DuplicateRecordFoundError, NoRecordFoundError } from '../../errors';
import { MESSAGES } from '../../constants/messages';
import { FindManyOptions, In, Like } from 'typeorm';
import logger from '../../../util/logger';
import { WalletService } from './wallet.service';
import axios from 'axios';
import AnalyticsService from '../../../util/mixPanel.config';
import { getIPAddress } from '../../../util/appUtils';

const analyticsService = new AnalyticsService();//class object
const walletService = new WalletService();

// Get repositories
const tagRepository = AppDataSource.getRepository(Tag);
const protocolRepository = AppDataSource.getRepository(Protocol);
const walletRepository = AppDataSource.getRepository(Wallet);
const userRepository = AppDataSource.getRepository(User);
const onBoardingFunnelRepository = AppDataSource.getRepository(OnBoardingFunnel);
const socialHandleRepository = AppDataSource.getRepository(SocialHandle);

// Interface for user data
interface UserData {
	id?:string,
	sub: string;
	fullName: string;
	userName: string;
	email: string;
	phone: string;
	gender: string;
	profilePicture: string;
	title: string;
	biography: string;
	role: string;
	// Add any other properties if necessary
}
// Service class for User
@Service()
export class UserService {
	constructor() {}

	// Method to create a new user
	public async create(data: User): Promise<object> {
		try {
			logger.info(`[UserService][create]  - ${JSON.stringify(data)}`);
			const userObj = { ...data };
			if(userObj.email){
				const userEmailExist = await userRepository.findOneBy({
					email: userObj.email,
				});
				if (userEmailExist) {
					throw new DuplicateRecordFoundError(MESSAGES.USER_EMAIL_EXIST);
				}
			}
			let subSptit :string[]=[];
			const user = await userRepository.save(userObj);
			if(data.sub){
				subSptit = data.sub.split('|');
				// checking if user is onboarding through wallet
				if(subSptit[1] === 'siwe'){
					const addressSplit = subSptit[2].split('0x');
					const address = `0x${addressSplit}`;
					const wallet  = new Wallet();
					wallet.address  = address;
					wallet.userId  = user.id;
					await walletService.create(user.id,wallet);
				}
			}
			try {
				await analyticsService.track('User Created', JSON.stringify({ userId: user.id }), user.id);
			} catch (err) {
				logger.log('error', `Error tracking user creation: ${err}`);
			}
			return user;
		} catch (error) {
			logger.error(`[UserService][create] - Error : ${error}`);
			throw error;
		}
	}

	// Method to list users with optional search parameters
	public async list(searchParams: { userName?: string, email?: string, phone?: string,limit?: number,offset?: number }): Promise<object> {
		try {
			logger.info(`[UserService][list]  - ${JSON.stringify(searchParams)}`);
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
		} catch (error) {
			logger.error(`[UserService][create] - Error : ${error}`);
			throw error;
		}
	}

	// Method to retrieve a user by ID
	public async get(userId: string): Promise<object | null> {
		try {
			logger.info(`[UserService][get]  - ${JSON.stringify(userId)}`);
			if(userId){
				const user = await userRepository.findOne({
					where: { id: userId },
				});
				if (!user) {
					throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
				}
				const onBoardingFunnels = await this.getOnboardFunnel(userId);
				const wallets = await walletRepository.find({where:{userId}});
				const userData = { ...user, onBoardingFunnels, wallets };
				try {
					await analyticsService.track('Profile Visit', JSON.stringify({ userId: user.id }), user.id);
				} catch (err) {
					logger.log('error', `Error tracking user creation: ${err}`);
				}
				return userData;
			}else {
				throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
			}
		} catch (error) {
			logger.error(`[UserService][get] - Error : ${error}`);
			throw error;
		}


	}

	// Method to update an existing user
	public async update(userId: string, data: Partial<User>): Promise<object> {
		try {
			logger.info(`[UserService][update]  - ${JSON.stringify(data)}`);
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
			// if(user.email){
			// 	this.checkUserLink(user)
			// }
			await userRepository.save(user);
			return user;
		} catch (error) {
			logger.error(`[UserService][update] - Error : ${error}`);
			throw error;
		}
	}

	// Method to delete a user by ID
	public async delete(userId: string): Promise<object> {
		try {
			logger.info(`[UserService][delete]  - ${JSON.stringify(userId)}`);
			const user = await userRepository.findOneBy({
			id: userId,
		});
		if (!user) {
			throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
		}
		await userRepository.delete(userId);
		return { success: true };
		} catch (error) {
			logger.error(`[UserService][delete] - Error : ${error}`);
			throw error;
		}
	}

	// Method to save tags for a user
	public async saveTags(userId: string, tagIds: string[]): Promise<User> {
		try {
			logger.info(`[UserService][saveTags]  - user : ${JSON.stringify(userId)} , tag :${JSON.stringify(tagIds)}`);
			const user = await userRepository.findOne({ where: { id: userId }, relations: ['tags'] });
			if (!user) {
				throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
			}
			const tags = await tagRepository.find({ where: { id: In(tagIds) } });
			user.tags = tags;
			await userRepository.save(user);
			return user;
		} catch (error) {
			logger.error(`[UserService][saveTags] - Error : ${error}`);
			throw error;
		}
	}

	// Method to update tags for a user
	public async updateTags(userId: string, tagIds: string[]): Promise<User> {
		try {
			logger.info(`[UserService][updateTags]  - user : ${JSON.stringify(userId)} , tag :${JSON.stringify(tagIds)}`);
			const user = await userRepository.findOne({ where: { id: userId }, relations: ['tags'] });
			if (!user) {
				throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
			}
			const tags = await tagRepository.find({ where: { id: In(tagIds) } });
			user.tags = tags;
			await userRepository.save(user);
			return user;
		} catch (error) {
			logger.error(`[UserService][updateTags] - Error : ${error}`);
			throw error;
		}
	}

	// Method to list tags for a user
	public async listTags(userId: string): Promise<User> {
		try {
			logger.info(`[UserService][listTags]  - user : ${JSON.stringify(userId)}`);
			const user = await userRepository.findOne({ where: { id: userId }, relations: ['tags'] });
			if (!user) {
				throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
			}
			return user;
		} catch (error) {
			logger.error(`[UserService][listTags] - Error : ${error}`);
			throw error;
		}
	}

	// Method to save protocols for a user
	public async saveProtocols(userId: string, protocolIds: string[]): Promise<User> {
		try {
			logger.info(`[UserService][saveProtocols]  - user : ${JSON.stringify(userId)} , protocols :${JSON.stringify(protocolIds)}`);
			const user = await userRepository.findOne({ where: { id: userId }, relations: ['protocols'] });
			if (!user) {
				throw new NoRecordFoundError('User not found');
			}
			const protocols = await protocolRepository.find({ where: { id: In(protocolIds) } });
			user.protocols = protocols;
			await userRepository.save(user);
			return user;
		} catch (error) {
			logger.error(`[UserService][saveProtocols] - Error : ${error}`);
			throw error;
		}

	}

	// Method to update protocols for a user
	public async updateProtocols(userId: string, protocolIds: string[]): Promise<User> {
		try {
			logger.info(`[UserService][updateProtocols]  - user : ${JSON.stringify(userId)} , protocols :${JSON.stringify(protocolIds)}`);
			const user = await userRepository.findOne({ where: { id: userId }, relations: ['protocols'] });
			if (!user) {
				throw new NoRecordFoundError('User not found');
			}
			const protocols = await protocolRepository.find({ where: { id: In(protocolIds) } });
			user.protocols = protocols;
			await userRepository.save(user);
			return user;
		} catch (error) {
			logger.error(`[UserService][updateProtocols] - Error : ${error}`);
			throw error;
		}
	
	}

	// Method to list protocols for a user
	public async listProtocols(userId: string): Promise<User> {
		try {
			logger.info(`[UserService][listProtocols]  - user : ${JSON.stringify(userId)}`);
			const user = await userRepository.findOne({ where: { id: userId }, relations: ['protocols'] });
			if (!user) {
				throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
			}
			return user;
		} catch (error) {
			logger.error(`[UserService][listProtocols] - Error : ${error}`);
			throw error;
		}
	}

	// Method to set an onboarding funnel stage for a user
	public async setOnboardFunnel(userId: string, stage: string, status: string): Promise<OnBoardingFunnel | undefined> {
		try {
			logger.info(`[UserService][setOnboardFunnel]  - user : ${JSON.stringify(userId)} , stage :${JSON.stringify(stage)} , status :${JSON.stringify(status)}`);
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
		} catch (error) {
			logger.error(`[UserService][setOnboardFunnel] - Error : ${error}`);
			throw error;
		}
	}

	// Method to get onboarding funnels for a user
	public async getOnboardFunnel(userId: string): Promise<object> {
		try {
			logger.info(`[UserService][getOnboardFunnel]  - user : ${JSON.stringify(userId)}`);
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
		} catch (error) {
			logger.error(`[UserService][getOnboardFunnel] - Error : ${error}`);
			throw error;
		}
	}

		// Method to create or update a user's social handle
		public async createOrUpdateSocialHandle(userId: string, url:string, platform:string): Promise<SocialHandle> {
			const user = await userRepository.findOne({
				where: { id: userId },
			});
			if (!user) {
				throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
			}
	
			let socialHandle = await socialHandleRepository.findOne({ where: { userId, platform:platform } });

			if (!socialHandle) {
				socialHandle = new SocialHandle();
				socialHandle.userId = userId;
				socialHandle.platform = platform;
			}
	
			socialHandle.url = url;
			await socialHandleRepository.save(socialHandle);
			return socialHandle;
		}
		// Method to retrieve a user's social handles
		public async getSocialHandles(userId: string): Promise<SocialHandle[]> {
			return socialHandleRepository.find({ where: { userId } });
		}

		public async checkUser(data: UserData): Promise<object | null> {
			let userId: string = '';
			let userExist: boolean = false;
	
			// Check user existence by sub
			if (data.sub) {
				const userauthkeyExist = await userRepository.findOne({
					where: { sub: data.sub }
				});
				if (userauthkeyExist) {
					userExist = true;
					userId = userauthkeyExist.id;
					// await this.linkUser(userauthkeyExist.sub, data.sub);
				}
			}
	
			// Check user existence by email
			if (data.email) {
				const userEmailExist = await userRepository.findOne({
					where: { email: data.email }
				});
				if (userEmailExist) {
					userExist = true;
					userId = userEmailExist.id;
					// await this.linkUser(userEmailExist.sub, data.sub);
				}
			}
	
			// Create new user if not found
			if (!userExist) {
				const newUser = new User();
				newUser.fullName = data.fullName;
				newUser.userName = data.userName;
				newUser.email = data.email;
				newUser.phone = data.phone;
				newUser.gender = data.gender;
				newUser.profilePicture = data.profilePicture;
				newUser.title = data.title;
				newUser.biography = data.biography;
				newUser.role = data.role;
				newUser.sub = data.sub;
				await this.create(newUser);
				userId = newUser.id;
				// Fetch IP address of the current user
				const ip = await getIPAddress();
				//Create User for mixpanel
				analyticsService.setUser(newUser.id, ip);  
			}
	
			// Get and return user data
			const user = await this.get(userId);
			return user;
		}

		// public async checkUserLink(data: UserData): Promise<object | null> {
		// 	const userId: string |undefined = data.id;
		// 	let userExist: boolean = false;
	
		// 	// Check user existence by sub
		// 	if (data.sub) {
		// 		const userSubQuery = userRepository.createQueryBuilder('user')
		// 		.where('user.sub = :sub', { sub: data.sub }).andWhere('user.id != :userId', { userId });
		// 		const userauthkeyExist = await userSubQuery.getOne();
		// 		if (userauthkeyExist) {
		// 			// await this.linkUser(userauthkeyExist.sub, data.sub);
		// 		}
		// 	}
	
		// 	// Check user existence by email
		// 	if (data.email) {
		// 		const userEmailExist = await userRepository.findOne({
		// 			where: { email: data.email }
		// 		});
		// 		if (userEmailExist) {
		// 			userExist = true;
		// 			userId = userEmailExist.id;
		// 			// await this.linkUser(userEmailExist.sub, data.sub);
		// 		}
		// 	}
	
		// 	// Create new user if not found
		// 	if (!userExist) {
		// 		const newUser = new User();
		// 		newUser.fullName = data.fullName;
		// 		newUser.userName = data.userName;
		// 		newUser.email = data.email;
		// 		newUser.phone = data.phone;
		// 		newUser.gender = data.gender;
		// 		newUser.profilePicture = data.profilePicture;
		// 		newUser.title = data.title;
		// 		newUser.biography = data.biography;
		// 		newUser.role = data.role;
		// 		newUser.sub = data.sub;
		// 		await this.create(newUser);
		// 		userId = newUser.id;
		// 	}
	
		// 	// Get and return user data
		// 	const user = await this.get(userId);
		// 	return user;
		// }
	
	
		// Method to link users
		public async linkUser(primaryUserId: string, secondaryUserId: string): Promise<{ success: boolean }> {
			const url = 'https://login.auth0.com/api/v2/users/' + primaryUserId + '/identities';
			const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
			const reqData = { 'provider': 'auth0', 'connection_id': 'string', 'user_id': secondaryUserId, 'link_with': 'string' };
	
			await axios.post(url, reqData, { headers })
				.then(response => { logger.info(`[AuthenticationService][unLinkUser]  - response : ${JSON.stringify(response.data)}`);})
				.catch(error => { logger.error(`[AuthenticationService][unLinkUser]  - error :${JSON.stringify(error)}`);});
	
			return { success: true };
		}
	
		// Method to unlink users
		public async unLinkUser(primaryUserId: string, provider: string): Promise<{ success: boolean }> {
			const config = {
				method: 'delete',
				maxBodyLength: Infinity,
				url: 'https://login.auth0.com/api/v2/users/' + primaryUserId + '/identities/' + provider + '/:user_id',
				headers: { 'Accept': 'application/json' }
			};
	
			await axios.request(config)
				.then(response => { logger.info(`[AuthenticationService][unLinkUser]  - response : ${JSON.stringify(response.data)}`);})
				.catch(error => { logger.error(`[AuthenticationService][unLinkUser]  - error :${JSON.stringify(error)}`);});
	
			return { success: true };
		}
}
