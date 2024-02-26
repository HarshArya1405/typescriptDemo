import { IsNotEmpty, IsNumber,IsNumberString, IsPositive, IsAlpha,IsOptional ,IsAlphanumeric,IsStrongPassword,IsEmail, IsString, IsArray} from 'class-validator';
import {
    Body, Delete, Get, JsonController, Param, Post, Put, QueryParams, UseBefore
} from 'routing-controllers';
import { Authentication } from '../middleware/authentication';

import { ResponseSchema } from 'routing-controllers-openapi';
import {User} from '../models/user.model';
import { UserService } from '../services/user.service';
import { Tag } from '../models/tag.model';
import { Protocol } from '../models/protocol.model';

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
    public authOkey!: string;
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
    public authOkey!: string;

}

class CreateUserBody extends BaseUser {
    @IsString()
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
    public authOkey!: string;
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

class SaveUserTagsBody {
    @IsNotEmpty()
    @IsArray()
    public tagIds!: number[];
}

class SaveUserProtocolsBody {
    @IsNotEmpty()
    @IsArray()
    public protocolIds!: number[];
}

class ListTagsQuery {
    @IsNumber()
    @IsNotEmpty()
    limit!: number;
  
    @IsNumber()
    @IsNotEmpty()
    offset!: number;

    @IsOptional()
    name?: string;
  }

class ListProtocolsQuery {
    @IsNumber()
    @IsNotEmpty()
    limit!: number;

    @IsNumber()
    @IsNotEmpty()
    offset!: number;

    @IsOptional()
    name?: string;

    @IsOptional()
    category?: string;
}

// @Authorized()
@JsonController('/user')
// @OpenAPI({ security: [{ basicAuth: [] }] })
export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
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
        user.authOkey = body.authOkey;
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
        user.authOkey = body.authOkey;
        return userService.update(id, user);
    }

    @Delete('/:id')
    public async delete(@Param('id') id: number): Promise<void> {
        await userService.delete(id);
    }

    @Post('/:userId/tags')
    public async saveUserTags(@Param('userId') userId: number, @Body() body: SaveUserTagsBody): Promise<User> {
    const { tagIds } = body;
    return userService.saveUserTags(userId, tagIds);
  }
    @Put('/:userId/tags')
    public async updateUserTags(@Param('userId') userId: number, @Body() body: SaveUserTagsBody): Promise<User> {
    const { tagIds } = body;
    return userService.updateUserTags(userId, tagIds);
  }
  @Get('/:userId/tags')
  public async listUserTags(@Param('userId') userId: number, @QueryParams() query: ListTagsQuery): Promise<{ tags: Tag[], count: number }> {
      const { offset, limit, name } = query;
      const nameFilter = name || '';
      const { tags, count } = await this.userService.listUserTags(userId, offset, limit, nameFilter);
  
      return { count, tags };
  }  

  @Post('/:userId/protocols')
  public async saveUserProtocols(@Param('userId') userId: number, @Body() body: SaveUserProtocolsBody): Promise<User> {
      const { protocolIds } = body;
      return userService.saveUserProtocols(userId, protocolIds);
  }

  @Put('/:userId/protocols')
  public async updateUserProtocols(@Param('userId') userId: number, @Body() body: SaveUserProtocolsBody): Promise<User> {
      const { protocolIds } = body;
      return userService.updateUserProtocols(userId, protocolIds);
  }

  @Get('/:userId/protocols')
  public async listUserProtocols(@Param('userId') userId: number, @QueryParams() query: ListProtocolsQuery): Promise<{ protocols: Protocol[], count: number }> {
      const { offset, limit, name, category } = query;
      const nameFilter = name || '';
      const categoryFilter = category || '';
      const { protocols, count } = await this.userService.listUserProtocols(userId, offset, limit, nameFilter, categoryFilter);
  
      return { count, protocols };
  }
}
