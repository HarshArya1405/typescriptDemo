import { IsPositive, IsAlphanumeric, IsOptional, isUUID } from 'class-validator';
import { Body, Get, JsonController, Param, Put, QueryParams } from 'routing-controllers';
import { AuthService } from '../services/auth0User.service';
import { User, auth0User } from '../../models';
import { BadRequestParameterError } from '../../errors';

// Create an instance of the authentication service
const authService = new AuthService();

// Define the query parameters for listing users
class GetUsersQuery {
    @IsPositive()
    @IsOptional()
    public limit?: number;

    @IsPositive()
    @IsOptional()
    public offset?: number;

    @IsOptional()
    @IsAlphanumeric()
    public userName?: string;

    @IsOptional()
    @IsAlphanumeric()
    public email?: string;

    @IsOptional()
    @IsAlphanumeric()
    public phone?: string;
}

interface UserData {
    fullName: string;
    userName: string;
    email: string;
    phone: string;
    gender: string;
    profilePicture: string;
    title: string;
    biography: string;
    userId: string;
    sub: string;
    role: string;
}

// Controller for user endpoints
@JsonController('/api/v1/auth0-user')
export class AuthUserController {

    constructor() { }

    /**
     * Endpoint to list users based on query parameters
     * @param query Query parameters
     * @returns List of users
     */
    @Get()
    public async list(@QueryParams() query: GetUsersQuery): Promise<object> {
        return await authService.list(query);
    }

    /**
     * Endpoint to get a user by ID
     * @param id User ID
     * @returns User information if found, else null
     */
    @Get('/:id')
    public async get(@Param('id') id: string): Promise<object | null> {
        // If 'id' is defined check if it's a valid UUID format
        if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
        return await authService.get(id);
    }

    /**
     * Endpoint to update a user by ID
     * @param id User ID
     * @param body Partial user data to update
     * @returns Updated user
     */
    @Put('/:id')
    public async update(@Param('id') id: string, @Body() body: Partial<UserData>): Promise<User | auth0User | null> {
        // If 'id' is defined check if it's a valid UUID format
        if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
        return await authService.updateAuth0User(id, body as UserData); // Cast body as UserData
    }

        /**
     * Endpoint to get all auth0 users of a specific user
     * @param userId User ID
     * @param query Query parameters
     * @returns List of auth0 users
     */
        @Get('/:userId/auth')
        public async getAllAuth0Users(@Param('userId') userId: string, @QueryParams() query: GetUsersQuery): Promise<object> {
            // If 'userId' is defined check if it's a valid UUID format
            if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid userId, UUID format expected but received ${userId}`);
            return await authService.getAllAuth0Users(userId, query);
        }
}
