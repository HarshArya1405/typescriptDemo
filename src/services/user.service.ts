import User from '../models/user.model';

interface UserCreationParams {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    password: string;
    mobile: string;
    gender: string;
}

class UserService {
    async createUser({
        firstName,
        middleName,
        lastName,
        email,
        password,
        mobile,
        gender
    }: UserCreationParams): Promise<User> {
        const user = await User.create({
            firstName,
            middleName,
            lastName,
            email,
            password,
            mobile,
            gender
        });
        return user;
    }
}

export default new UserService();
