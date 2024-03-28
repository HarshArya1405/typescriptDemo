import { Service } from 'typedi';
import { Role, User, Protocol, Tag, OnBoardingFunnel, SocialHandle, Wallet, Auth0User, CreatorFollower } from '../../models';
import { AppDataSource } from '../../../loaders/typeormLoader';
import { DuplicateRecordFoundError, NoRecordFoundError } from '../../errors';
import { MESSAGES } from '../../constants/messages';
import { FindManyOptions, In, Like } from 'typeorm';
import logger from '../../../util/logger';
import { WalletService } from './wallet.service';
import axios from 'axios';
import AnalyticsService from '../../../util/mixPanel.config';
// import { getIPAddress } from '../../../util/appUtils';
import { getSignedUrlForRead } from '../../../util/s3Utils';
import { AuthService } from './auth0User.service';
// import { UserEventEmitter } from '../../../events/EventEmitters';

const analyticsService = new AnalyticsService();//class object
const authService = new AuthService();
const walletService = new WalletService();
// const userEventEmitter = new UserEventEmitter();
// Get repositories
const tagRepository = AppDataSource.getRepository(Tag);
const protocolRepository = AppDataSource.getRepository(Protocol);
const walletRepository = AppDataSource.getRepository(Wallet);
const userRepository = AppDataSource.getRepository(User);
const onBoardingFunnelRepository = AppDataSource.getRepository(OnBoardingFunnel);
const socialHandleRepository = AppDataSource.getRepository(SocialHandle);
const auth0UserRepository = AppDataSource.getRepository(Auth0User);
const roleRepository = AppDataSource.getRepository(Role);
const creatorFollowersRepository = AppDataSource.getRepository(CreatorFollower);



// Interface for user data
interface UserData {
	id?: string,
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
interface UserDataResponse {
	id?: string,
	fullName: string;
	userName: string;
	email: string;
	phone: string;
	gender: string;
	profilePicture: object;
	title: string;
	biography: string;
	onBoardingFunnels: object
	wallets: Wallet[]

	// Add any other properties if necessary
}

interface UserWithFollowStatus {
    user: User;
    followed: boolean;
}
// Service class for User
@Service()
export class UserService {
	constructor() { }

	// Method to create a new user
	public async create(data: UserData): Promise<User> {
		try {
			logger.info(`[UserService][create]  - ${JSON.stringify(data)}`);
			// Fetch role based on role name
			const roleName = data.role;
			// Save user's role
			const role = await roleRepository.findOne({ where: { name: roleName } });
			let roles : Role[]= [];
			if (role) {
				roles = [role];
			}
			const userObj = { ...data,roles };
			if (userObj.email) {
				const userEmailExist = await userRepository.findOneBy({
					email: userObj.email,
				});
				if (userEmailExist) {
					throw new DuplicateRecordFoundError(MESSAGES.USER_EMAIL_EXIST);
				}
			}
			const user = await userRepository.save(userObj);
			if (data.sub) {
				let subSptit: string[] = [];
				subSptit = data.sub.split('|');
				// checking if user is onboarding through wallet
				if (subSptit[1] === 'siwe') {
					const addressSplit = subSptit[2].split('0x');
					const address = `0x${addressSplit}`;
					const wallet = new Wallet();
					wallet.address = address;
					wallet.userId = user.id;
					await walletService.create(user.id, wallet);
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
	public async list(searchParams: { userName?: string, email?: string, phone?: string, limit?: number, offset?: number }): Promise<object> {
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
			if (userId) {
				const user = await userRepository.findOne({
					where: { id: userId },
					relations: ['roles','socialHandles']
				});
				if (!user) {
					throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
				}
				// Remove profilePicture from user object
				const { profilePicture, ...userData } = user;

				const onBoardingFunnels = await this.getOnboardFunnel(userId);
				const wallets = await walletRepository.find({ where: { userId } });

				const userObj: UserDataResponse = { ...userData, profilePicture: { url: '', path: '' }, onBoardingFunnels, wallets };
				if (userData.profilePicturePath) {
					const url = (await getSignedUrlForRead({ path: userData.profilePicturePath })).url;
					const profilePictureObj: { url: string, path: string } = { url, path: userData.profilePicturePath };
					userObj.profilePicture = profilePictureObj;
				} else {
					userObj.profilePicture = {
						url: profilePicture,
						path: ''
					};
				}
				try {
					await analyticsService.track('Profile Visit', JSON.stringify({ userId: user.id }), user.id);
				} catch (err) {
					logger.log('error', `Error tracking user creation: ${err}`);
				}
				return userObj;
			} else {
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
	public async setOnboardFunnel(userId: string, stage: string, status: string, role: string): Promise<OnBoardingFunnel | undefined> {
		try {
			logger.info(`[UserService][setOnboardFunnel]  - user : ${JSON.stringify(userId)} , stage :${JSON.stringify(stage)} , status :${JSON.stringify(status)}, role : ${JSON.stringify(role)}`);
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
					onboardingFunnel.role = role;
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
	public async createOrUpdateSocialHandle(userId: string, url: string, platform: string): Promise<SocialHandle> {
		const user = await userRepository.findOne({
			where: { id: userId },
		});
		if (!user) {
			throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
		}

		let socialHandle = await socialHandleRepository.findOne({ where: { userId, platform: platform } });

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

		// Check user existence by sub
		if (data.sub) {
			const userAuth0 = await auth0UserRepository.findOne({ where: { sub: data.sub } });
			if (userAuth0) {
				userId = userAuth0.userId;
			}
		}

		// If user doesn't exist, create new user
		if (!userId) {
			// Creating the user
			const createdAuth0User = await authService.createAuth0User(data);
			if (createdAuth0User) {
				const savedUser = await this.create(data);
				userId = savedUser.id;
				createdAuth0User.userId = userId;
				await auth0UserRepository.save(createdAuth0User);
			} else {
				// Handle the case where user creation failed
				throw new Error('User creation failed');
			}
		}

		// Fetch and return user data
		return await this.get(userId);
	}

	// Function to delete OnBoardingFunnel based on parameters
	public async deleteOnboardFunnel(userId: string, body: { stage: string; role: string }): Promise<{ success: boolean }> {
		try {
			// Fetch the onboarding funnel record based on userId, stage, and role
			const onboardingFunnel = await onBoardingFunnelRepository.findOne({
				where: { userId: userId, stage: body.stage, role: body.role }
			});
	
			// If no matching record found, return error message
			if (!onboardingFunnel) {
				throw new NoRecordFoundError('No matching record found to delete');
			}
	
			// Delete the record
			await onBoardingFunnelRepository.delete(onboardingFunnel.id);
			
			return { success: true };
		} catch (error) {
			logger.error(`[UserService][deleteOnboardFunnel] - Error: ${error}`);
			throw new Error('Failed to delete onboarding funnel record');
		}
	}

	public async linkUser(primaryUserId: string, secondaryUserId: string): Promise<{ success: boolean }> {
		const url = 'https://login.auth0.com/api/v2/users/' + primaryUserId + '/identities';
		const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
		const reqData = { 'provider': 'auth0', 'connection_id': 'string', 'user_id': secondaryUserId, 'link_with': 'string' };

		await axios.post(url, reqData, { headers })
			.then(response => { logger.info(`[AuthenticationService][unLinkUser]  - response : ${JSON.stringify(response.data)}`); })
			.catch(error => { logger.error(`[AuthenticationService][unLinkUser]  - error :${JSON.stringify(error)}`); });

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
			.then(response => { logger.info(`[AuthenticationService][unLinkUser]  - response : ${JSON.stringify(response.data)}`); })
			.catch(error => { logger.error(`[AuthenticationService][unLinkUser]  - error :${JSON.stringify(error)}`); });

		return { success: true };
	}
	// Method to list all creators
	public async listCreators(currentUser: User, searchParams: { limit?: number, offset?: number }): Promise<object> {
		try {
			logger.info(`[UserService][listCreators]  - ${JSON.stringify(searchParams)}`);
			const options: FindManyOptions<User> = {
				skip: searchParams.offset,
				take: searchParams.limit,
				where: { roles: { name: 'creator' } },
				relations: ['roles']
			};
	
			const [creators, count] = await userRepository.findAndCount(options);
	
			// Iterate through each creator to determine if the current user is following them
			const creatorsWithFollowStatus: UserWithFollowStatus[] = await Promise.all(
				creators.map(async (creator: User) => {
					const isFollowing = await creatorFollowersRepository.findOne({
						where: { creatorId: creator.id, id: currentUser.id }
					});
					return { user: creator, followed: !!isFollowing };
				})
			);
	
			return { count, creators: creatorsWithFollowStatus };
		} catch (error) {
			logger.error(`[UserService][listCreators] - Error : ${error}`);
			throw error;
		}
	}
}
