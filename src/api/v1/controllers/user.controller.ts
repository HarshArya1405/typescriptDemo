// Import necessary modules and types
import { IsNotEmpty, IsArray, IsNumber, IsNumberString, IsPositive, IsAlpha, IsOptional, IsAlphanumeric, IsEmail, IsString, IsEnum, isUUID } from 'class-validator';
import { Body, Delete, Get, JsonController, Param, Post, Put, QueryParams } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { User, OnBoardingFunnel, SocialHandle } from '../../models';
import { UserService } from '../services/user.service';
import { BadRequestParameterError } from '../../errors';

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
    public tagIds!: number[];
}

// Define the body for saving protocols
class SaveProtocolsBody {
    @IsNotEmpty()
    @IsArray()
    public protocolIds!: number[];
}

// Define the response schema for the user
export class UserResponse extends BaseUser {
    @IsString()
    public fullName!: string;

    @IsAlphanumeric()
    public userName!: string;

    @IsEmail()
    public email!: string;

    @IsAlphanumeric()
    public phone!: string;

    @IsAlpha()
    public gender!: string;
}

// Define the body for creating a new user
class CreateUserBody extends BaseUser {}

// Define the query parameters for listing users
class GetUsersQuery {
    @IsPositive()
    public limit!: number;

    @IsNumber()
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

    constructor() {}

    // Create a new user
    @Post()
    @ResponseSchema(UserResponse)
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

    // Get a user by ID
    @Get('/:id')
    @ResponseSchema(UserResponse)
    public async get(@Param('id') id: string): Promise<object | null> {
        if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
        return userService.get(id);
    }

    // List users based on query parameters
    @Get()
    @ResponseSchema(UserResponse, { isArray: true })
    public async list(@QueryParams() query: GetUsersQuery): Promise<object> {
        return userService.list(query);
    }

    // Update a user by ID
    @Put('/:id')
    @ResponseSchema(UserResponse)
    public async update(@Param('id') id: string, @Body() body: Partial<User>): Promise<object> {
        if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
        return userService.update(id, body);
    }

    // Delete a user by ID
    @Delete('/:id')
    public async delete(@Param('id') id: string): Promise<object> {
        if (id && !isUUID(id)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${id}`);
        return userService.delete(id);
    }

    // Tag and protocol APIs

    // Save tags for a user
    @Post('/:userId/tags')
    public async saveTags(@Param('userId') userId: string, @Body() body: SaveTagsBody): Promise<User> {
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${userId}`);
        const { tagIds } = body;
        return userService.saveTags(userId, tagIds);
    }

    // Update tags for a user
    @Put('/:userId/tags')
    public async updateTags(@Param('userId') userId: string, @Body() body: SaveTagsBody): Promise<User> {
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${userId}`);
        const { tagIds } = body;
        return userService.updateTags(userId, tagIds);
    }

    // List tags for a user
    @Get('/:userId/tags')
    public async listTags(@Param('userId') userId: string): Promise<User> {
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${userId}`);
        return await userService.listTags(userId);
    }

    // Save protocols for a user
    @Post('/:userId/protocols')
    public async saveUserProtocols(@Param('userId') userId: string, @Body() body: SaveProtocolsBody): Promise<User> {
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${userId}`);
        const { protocolIds } = body;
        return userService.saveProtocols(userId, protocolIds);
    }

    // Update protocols for a user
    @Put('/:userId/protocols')
    public async updateProtocols(@Param('userId') userId: string, @Body() body: SaveProtocolsBody): Promise<User> {
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${userId}`);
        const { protocolIds } = body;
        return userService.updateProtocols(userId, protocolIds);
    }

    // List protocols for a user
    @Get('/:userId/protocols')
    public async listProtocols(@Param('userId') userId: string): Promise<User> {
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${userId}`);
        return await userService.listProtocols(userId);
    }

    // Onboarding funnel APIs

    // Set onboard funnel for a user
    @Post('/:userId/onboardFunnel')
    public async setOnboardFunnel(@Param('userId') userId: string, @Body() body: OnboardFunnelBody): Promise<OnBoardingFunnel | undefined> {
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${userId}`);
        return userService.setOnboardFunnel(userId, body.stage, body.status);
    }

    // Get onboard funnel for a user
    @Get('/:userId/onboardFunnel')
    public async getOnboardFunnel(@Param('userId') userId: string): Promise<object> {
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${userId}`);
        return userService.getOnboardFunnel(userId);
    }

    // Create or update a user's social handle
    @Post('/:userId/SocialHandle')
    public async createOrUpdateSocialHandle(@Param('userId') userId: string, @Body() body: SocialHandleBody): Promise<SocialHandle> {
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${userId}`);
        const { url, platform } = body;
        return userService.createOrUpdateSocialHandle(userId, platform, url);
    }

    // Get a user's social handles
    @Get('/:userId/SocialHandle')
    public async getSocialHandles(@Param('userId') userId: string): Promise<SocialHandle[]> {
        if (userId && !isUUID(userId)) throw new BadRequestParameterError(`Invalid id, UUID format expected but received ${userId}`);
        return userService.getSocialHandles(userId);
    }
}
