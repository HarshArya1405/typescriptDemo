import { IsNotEmpty, IsNumber, ValidateNested, IsBoolean,IsOptional} from 'class-validator';
import {
    Body, Get, JsonController, Param, Post, Put
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import {Role} from '../models/role.model';
import { RoleService } from '../services/role.service';

const roleService =  new RoleService();

class BaseRole {
    @IsNotEmpty()
    public name!: string;

    @IsOptional()
    public description!: string;

    @IsBoolean()
    public enabled!: boolean;
}

export class RoleResponse extends BaseRole {
    @IsNumber()
    public id!: number;

    @ValidateNested()
    public role!: RoleResponse;

}

class CreateRoleBody extends BaseRole {
    @IsNotEmpty()
    public name: string = '';

    @IsNotEmpty()
    public description: string = '';

    @IsBoolean()
    public enabled: boolean = false;
}


// @Authorized()
@JsonController('/role')
// @OpenAPI({ security: [{ basicAuth: [] }] })
export class RoleController {

    constructor() {
    }

    @Post()
    @ResponseSchema(RoleResponse)
    public async create(@Body() body: CreateRoleBody): Promise<Role> {
        const role = new Role();
        role.name = body.name;
        role.description = body.description;
        role.enabled = body.enabled;
        return roleService.create(role);
    }

    @Post('/bootstrap')
    @ResponseSchema(RoleResponse)
    public async bootstrap(): Promise<object> {
        return roleService.bootstrap();
    }

    @Get('/:name')
    @ResponseSchema(RoleResponse)
    public async get(@Param('name') name: string): Promise<Role | null> {
        return roleService.get(name);
    }

    @Put('/:id')
    @ResponseSchema(RoleResponse)
    public async update(@Param('id') id: number, @Body() body: BaseRole): Promise<object> {
        const role = new Role();
        role.name = body.name;
        role.description = body.description;
        role.enabled = body.enabled;
        return roleService.update(id, role);
    }
}
