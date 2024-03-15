import { Service } from 'typedi';
import { User, auth0User } from '../../models';
import { AppDataSource } from '../../../loaders/typeormLoader';
import { NoRecordFoundError } from '../../errors';
import { MESSAGES } from '../../constants/messages';
import logger from '../../../util/logger';
import AnalyticsService from '../../../util/mixPanel.config';
import { FindManyOptions, Like } from 'typeorm';

const userRepository = AppDataSource.getRepository(User);
const auth0UserRepository = AppDataSource.getRepository(auth0User);
const analyticsService = new AnalyticsService();

interface UserData {
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
}

@Service()
export class AuthService {
    constructor() {}

    public async createAuth0User(data: UserData): Promise<User | auth0User | null> {
            let newUser: User | null = null;

            // Check if the user exists with the provided email
            if (data.email) {
                const existingUser = await userRepository.findOne({ where: { email: data.email } });

                // If the user already exists, return the existing user
                if (existingUser) {
                    return existingUser;
                }
            }

            // Create new auth0User
            const savedAuth0User = await auth0UserRepository.save(data);

            // If email is provided, save user in the user's table
            if (data.email) {
                newUser = new User();
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
                newUser.auth0UserId = savedAuth0User.id; // Link user to auth0User
                const savedUser = await userRepository.save(newUser);
                return savedUser;
            }

            // If email is not provided, return the saved auth0User
            return savedAuth0User;
    }

    public async updateAuth0User(userId: string, data: UserData): Promise<User | auth0User | null> {

            const existingAuth0User = await auth0UserRepository.findOne({ where: { id: userId } });

            if (!existingAuth0User) {
                throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
            }

            // Check if the new email is already in use
            if (data.email) {
                const userExist = await userRepository.findOne({ where: { email: data.email } });
                if (userExist) {
                    existingAuth0User.fullName = data.fullName;
                    existingAuth0User.userName = data.userName;
                    existingAuth0User.email = data.email;
                    existingAuth0User.phone = data.phone;
                    existingAuth0User.gender = data.gender;
                    existingAuth0User.profilePicture = data.profilePicture;
                    existingAuth0User.title = data.title;
                    existingAuth0User.biography = data.biography;
                    existingAuth0User.userId = userExist.id;
                    await auth0UserRepository.save(existingAuth0User);
                    //Updating user
                    userExist.fullName = data.fullName;
                    userExist.phone = data.phone;
                    userExist.profilePicture = data.profilePicture;
                    userExist.title = data.title;
                    userExist.biography = data.biography;
                    await userRepository.save(userExist);
                    return userExist;
                }
            }

            return existingAuth0User;
    }

    	// Method to retrieve a user by ID
	public async get(userId: string): Promise<object | null> {
		try {
			logger.info(`[Auth0UserService][get]  - ${JSON.stringify(userId)}`);
			if(userId){
				const user = await auth0UserRepository.findOne({
					where: { id: userId },
				});
				if (!user) {
					throw new NoRecordFoundError(MESSAGES.USER_NOT_EXIST);
				}
				const userData = { ...user};
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
			logger.error(`[Auth0UserService][get] - Error : ${error}`);
			throw error;
		}
	}

    public async list(searchParams: { userName?: string, email?: string, phone?: string, limit?: number, offset?: number }): Promise<object> {
        try {
            logger.info(`[Auth0UserService][list]  - ${JSON.stringify(searchParams)}`);
            const options: FindManyOptions<auth0User> = {
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

            const [users, count] = await auth0UserRepository.findAndCount(options);
            return { count, users };
        } catch (error) {
            logger.error(`[Auth0UserService][list] - Error : ${error}`);
            throw error;
        }
    }

    public async getAllAuth0Users(userId: string, searchParams: { limit?: number, offset?: number }): Promise<{ count: number; users: auth0User[] }> {
            const options: FindManyOptions<auth0User> = {
                skip: searchParams.offset,
                take: searchParams.limit,
                where: { userId },
            };
            const [users, count] = await auth0UserRepository.findAndCount(options);
            return { count, users };
    }
}
