// Import necessary modules and types
import { IsNotEmpty, IsArray, IsNumber, IsNumberString, IsPositive, IsAlpha, IsOptional, IsAlphanumeric, IsEnum, isUUID, IsString } from 'class-validator';
import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { User, OnBoardingFunnel,SocialHandle } from '../../models';
import { UserService } from '../services/user.service';
import { BadRequestParameterError } from '../../errors';
import logger from '../../../util/logger';

// Create an instance of the user service
const userService = new UserService();

// Define the base user class with common properties
class BaseUser {
    @IsNotEmpty()
    public fullName!: string;

    @IsNotEmpty()
    public role!: string;

    @IsOptional()
    public profilePicture!: string;

    @IsOptional()
    public biography!: string;

    @IsOptional()
    public title!: string;

    @IsNotEmpty()
    public userName!: string;

    @IsNotEmpty()
    public email!: string;

    @IsNumberString()
    public phone!: string;

    @IsNotEmpty()
    public gender!: string;
}

// Define the body for saving tags
class SaveTagsBody {
    @IsNotEmpty()
    @IsArray()
    public tagIds!: string[];
}

// Define the body for saving protocols
class SaveProtocolsBody {
    @IsNotEmpty()
    @IsArray()
    public protocolIds!: string[];
}


// Define the body for creating a new user
class CreateUserBody extends BaseUser { }

// Define the query parameters for listing users
class GetUsersQuery {
    @IsPositive()
    @IsOptional()
    public limit!: number;

    @IsNumber()
    @IsOptional()
    public offset!: number;

    @IsOptional()
    @IsAlphanumeric()
    public userName!: string;

    @IsOptional()
    @IsAlphanumeric()
    public email!: string;

    @IsOptional()
    @IsAlphanumeric()
    public phone!: string;
}
// Enum for onboarding funnel status
enum Status {
    Skipped = 'skipped',
    Completed = 'completed'
}

// Define the body for onboarding funnel
class OnboardFunnelBody {
    @IsNotEmpty()
    @IsAlpha()
    public stage!: string;

    @IsNotEmpty()
    @IsAlpha()
    @IsEnum(Status, { message: 'Invalid status. Must be one of: skipped, completed' })
    public status!: string;
}

class SocialHandleBody {
    @IsNotEmpty()
    @IsString()
    public platform!: string;

    @IsString()
    public url!: string;
}

// Controller for user endpoints
@JsonController('/api/v1/user')
export class UserController {

    constructor() { }

    /**
     * Endpoint to create a new user
     * @param body User data to create
     * @returns Created user
     */
    @Post()
    public async create(@Body() body: CreateUserBody): Promise<object> {
        // Create a new user object from the body
        const user = new User();
        user.fullName = body.fullName;
        user.userName = body.userName;
        user.email = body.email;
        user.phone = body.phone;
        user.gender = body.gender;
        user.profilePicture = body.profilePicture;
        user.title = body.title;
        user.biography = body.biography;
        user.role = body.role;
        return userService.create(user);
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
        return await userService.get(id);
    }

    /**
     * Endpoint to list users based on query parameters
     * @param query Query parameters
     * @returns List of users
     */
    @Get()
    public async list(@QueryParams() query: GetUsersQuery): Promise<object> {
        return await userService.list(query);
    }

    /**
     * Endpoint to update a user by ID
     * @param id User ID
     * @param body Partial user data to update
     * @returns Updated user
     */
    @Put('/:id')
    public async update(@Param('id') id: string, @Body() body: Partial<User>): Promise<object> {
        // If 'id' is defined check if it's a valid UUID format
        if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
        return await userService.update(id, body);
    }

    /**
     * Endpoint to delete a user by ID
     * @param id User ID
     * @returns Deletion result
     */
    @Delete('/:id')
    public async delete(@Param('id') id: string): Promise<object> {
        // If 'id' is defined check if it's a valid UUID format
        if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
        return await userService.delete(id);
    }

    // Tag and protocol APIs

    /**
     * Endpoint to save tags for a user
     * @param userId User ID
     * @param body Tag IDs to save
     * @returns Updated user with saved tags
     */
    @Post('/:userId/tags')
    public async saveTags(@Param('userId') userId: string, @Body() body: SaveTagsBody): Promise<User> {
        // If 'id' is defined check if it's a valid UUID format
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid userId, UUID format expected but received ${userId}`);
        const { tagIds } = body;
        return await userService.saveTags(userId, tagIds);
    }

    /**
     * Endpoint to update tags for a user
     * @param userId User ID
     * @param body Tag IDs to update
     * @returns Updated user with updated tags
     */
    @Put('/:userId/tags')
    public async updateTags(@Param('userId') userId: string, @Body() body: SaveTagsBody): Promise<User> {
        // If 'id' is defined check if it's a valid UUID format
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid userId, UUID format expected but received ${userId}`);
        const { tagIds } = body;
        return await userService.updateTags(userId, tagIds);
    }

    /**
     * Endpoint to list tags for a user
     * @param userId User ID
     * @returns List of tags associated with the user
     */
    @Get('/:userId/tags')
    public async listTags(@Param('userId') userId: string): Promise<User> {
        // If 'id' is defined check if it's a valid UUID format
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid userId, UUID format expected but received ${userId}`);
        return await userService.listTags(userId);
    }

    /**
     * Endpoint to save protocols for a user
     * @param userId User ID
     * @param body Protocol IDs to save
     * @returns Updated user with saved protocols
     */
    @Post('/:userId/protocols')
    public async saveUserProtocols(@Param('userId') userId: string, @Body() body: SaveProtocolsBody): Promise<User> {
        // If 'id' is defined check if it's a valid UUID format
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid userId, UUID format expected but received ${userId}`);
        const { protocolIds } = body;
        return await userService.saveProtocols(userId, protocolIds);
    }

    /**
     * Endpoint to update protocols for a user
     * @param userId User ID
     * @param body Protocol IDs to update
     * @returns Updated user with updated protocols
     */
    @Put('/:userId/protocols')
    public async updateProtocols(@Param('userId') userId: string, @Body() body: SaveProtocolsBody): Promise<User> {
        // If 'id' is defined check if it's a valid UUID format
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid userId, UUID format expected but received ${userId}`);
        const { protocolIds } = body;
        return await userService.updateProtocols(userId, protocolIds);
    }

    /**
     * Endpoint to list protocols for a user
     * @param userId User ID
     * @returns List of protocols associated with the user
     */
    @Get('/:userId/protocols')
    public async listProtocols(@Param('userId') userId: string): Promise<User> {
        // If 'id' is defined check if it's a valid UUID format
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid userId, UUID format expected but received ${userId}`);
        return await userService.listProtocols(userId);
    }

    // Onboarding funnel APIs

    /**
     * Endpoint to set onboard funnel for a user
     * @param userId User ID
     * @param body Onboarding funnel data
     * @returns Updated onboard funnel status
     */
    @Post('/:userId/onboardFunnel')
    public async setOnboardFunnel(@Param('userId') userId: string, @Body() body: OnboardFunnelBody): Promise<OnBoardingFunnel | undefined> {
        // If 'id' is defined check if it's a valid UUID format
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid userId, UUID format expected but received ${userId}`);
        return await userService.setOnboardFunnel(userId, body.stage, body.status);
    }

    /**
     * Endpoint to get onboard funnel for a user
     * @param userId User ID
     * @returns Onboard funnel status
     */
    @Get('/:userId/onboardFunnel')
    public async getOnboardFunnel(@Param('userId') userId: string): Promise<object> {
        // If 'id' is defined check if it's a valid UUID format
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid userId, UUID format expected but received ${userId}`);
        return await userService.getOnboardFunnel(userId);
    }

    /**
     * Endpoint to create or update a user's social handle
     * @param userId User ID
     * @param body Social handle data
     * @returns Created or updated social handle
     */
    @Post('/:userId/socialHandle')
    public async createSocialHandles(@Param('userId') userId: string, @Body() body: []): Promise<object> {
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${userId}`);
        for(const row of body){
            await this.createOrUpdateSocialHandle(userId,row);
        }
        return {success:true};
    }

    /**
     * Endpoint to create or update a user's social handle
     * @param userId User ID
     * @param body Social handle data
     * @returns Created or updated social handle
     */
    @Post('/:userId/saveSocialHandle')
    public async createOrUpdateSocialHandle(@Param('userId') userId: string, @Body() body: SocialHandleBody): Promise<SocialHandle | undefined> {
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${userId}`);
        try {
            return await userService.createOrUpdateSocialHandle(userId, body.url,body.platform);
        } catch (error) {
            logger.error(`[UserController][createOrUpdateSocialHandle] - Error : ${error}`);
			throw error;
        }
    }

    /**
     * Endpoint to get a user's social handles
     * @param userId User ID
     * @returns List of social handles associated with the user
     */
    @Get('/:userId/socialHandle')
    public async getSocialHandles(@Param('userId') userId: string): Promise<SocialHandle[]> {
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${userId}`);
        return await userService.getSocialHandles(userId);
    }
}
