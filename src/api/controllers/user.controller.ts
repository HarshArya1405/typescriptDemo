import { IsNotEmpty, IsNumber,IsNumberString, IsPositive, IsAlpha,IsOptional ,IsAlphanumeric,IsStrongPassword,IsEmail, IsString} from 'class-validator';
import {
    Body, Delete, Get, JsonController, Param, Post, Put, QueryParams, UseBefore
} from 'routing-controllers';
import { Authentication } from '../middleware/authentication';

import { ResponseSchema } from 'routing-controllers-openapi';
import {User} from '../models/user.model';
import { UserService } from '../services/user.service';

const userService =  new UserService();

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

    @IsNotEmpty()
    public password!: string;
}

export class UserResponse extends BaseUser {
    @IsString()
    public fullName!: string;

    @IsAlphanumeric()
    public userName!: string;

    @IsAlpha()
    @IsEmail()
    public email!: string;

    @IsAlpha()
    public phone!: string;

    @IsAlpha()
    public gender!: string;

    @IsStrongPassword()
    public password!: string;

}

class CreateUserBody extends BaseUser {
    @IsAlpha()
    public fullName!: string;

    @IsAlphanumeric()
    public userName!: string;

    @IsEmail()
    public email!: string;

    @IsNumberString()
    public phone!: string;

    @IsAlpha()
    public gender!: string;

    @IsStrongPassword()
    public password!: string;
}


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

// @Authorized()
@JsonController('/user')
// @OpenAPI({ security: [{ basicAuth: [] }] })
export class UserController {

    constructor() {
    }

    @Post()
    @ResponseSchema(UserResponse)
    public async create(@Body() body: CreateUserBody): Promise<User> {
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
        user.password = body.password;
        return userService.create(user);
    }

    @Get('/:id')
    @UseBefore(Authentication)
    @ResponseSchema(UserResponse)
    public async get(@Param('id') id: number): Promise<User | null> {
        return userService.get(id);
    }

    @Get()
    @ResponseSchema(UserResponse, { isArray: true })
    public async list(@QueryParams() query: GetUsersQuery): Promise<object> {
        return userService.list(query);
    }

    @Put('/:id')
    @ResponseSchema(UserResponse)
    public async update(@Param('id') id: number, @Body() body: BaseUser): Promise<object> {
        const user = new User();
        user.fullName = body.fullName;
        user.userName = body.userName;
        user.email = body.email;
        user.phone = body.phone;
        user.gender = body.userName;
        user.password = body.password;
        return userService.update(id, user);
    }

    @Delete('/:id')
    public async delete(@Param('id') id: number): Promise<void> {
        await userService.delete(id);
    }
}
