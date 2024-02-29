// Import dependencies
import { Service } from 'typedi';
import { UserService } from './user.service';
import { User } from '../../models/user.model';
import { AppDataSource } from '../../../loaders/typeormLoader';
import axios from 'axios';

// Get repository and instantiate UserService
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService();

// Interface for user data
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
	// Add any other properties if necessary
}

// Service class for authentication
@Service()
export class AuthenticationService {
	constructor() {}

	// Method to check user existence and create new if not found
	public async checkUser(data: UserData): Promise<object | null> {
		let userId: number = 0;
		let userExist: boolean = false;

		// Check user existence by authOkey
		if (data.sub) {
			const userauthkeyExist = await userRepository.findOne({
				where: { authOkey: data.sub },
				relations: ['onBoardingFunnels']
			});
			if (userauthkeyExist) {
				userExist = true;
				userId = userauthkeyExist.id;
				await this.linkUser(userauthkeyExist.authOkey, data.sub);
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
				await this.linkUser(userEmailExist.authOkey, data.sub);
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
			await userService.create(newUser);
			userId = newUser.id;
		}

		// Get and return user data
		const user = await userService.get(userId);
		return user;
	}

	// Method to link users
	public async linkUser(primaryUserId: string, secondaryUserId: string): Promise<{ success: boolean }> {
		const url = 'https://login.auth0.com/api/v2/users/' + primaryUserId + '/identities';
		const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
		const reqData = { 'provider': 'auth0', 'connection_id': 'string', 'user_id': secondaryUserId, 'link_with': 'string' };

		await axios.post(url, reqData, { headers })
			.then(response => { console.log('Response:', response.data); })
			.catch(error => { console.error('Error:', error.response.data); });

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
			.then(response => { console.log(JSON.stringify(response.data)); })
			.catch(error => { console.log(error); });

		return { success: true };
	}
}
