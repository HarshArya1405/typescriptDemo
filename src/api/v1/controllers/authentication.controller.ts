// Import necessary modules and types
import {
    Body, JsonController, Post
} from 'routing-controllers';

import { AuthenticationService } from '../services/authentication.service';

// Initialize authentication service
const authenticationService = new AuthenticationService();

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

// Controller for authentication endpoints
@JsonController('/api/v1/auth')
export class AuthenticationController {

    constructor() {
    }

    /**
     * Endpoint to check user existence
     * @param body User data to check
     * @returns User object if exists, otherwise null
     */
    @Post('/checkUser')
    public async checkUser(@Body() body: UserData): Promise<object | null> {
        const user: UserData = {
            fullName: body.fullName,
            userName: body.userName,
            email: body.email,
            phone: body.phone,
            gender: body.gender,
            profilePicture: body.profilePicture,
            title: body.title,
            biography: body.biography,
            role: body.role,
            sub: body.sub
        };
        return await authenticationService.checkUser(user);
    }

    /**
     * Endpoint to link a user
     * @param primaryUserId ID of the primary user
     * @param secondaryUserId ID of the secondary user
     * @returns Success message
     */
    @Post('/linkUser')
    public async linkUser(primaryUserId: string, secondaryUserId: string): Promise<{ success: boolean }> {
        return await authenticationService.linkUser(primaryUserId, secondaryUserId);
    }

    /**
     * Endpoint to unlink a user
     * @param primaryUserId ID of the primary user
     * @param provider User provider
     * @returns Success message
     */
    @Post('/unlinkUser')
    public async unlinkUser(primaryUserId: string, provider: string): Promise<{ success: boolean }> {
        return await authenticationService.linkUser(primaryUserId, provider);
    }
}
