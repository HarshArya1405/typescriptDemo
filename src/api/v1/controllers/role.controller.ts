// Import necessary modules and types
import { IsNotEmpty, IsNumber, ValidateNested, IsBoolean, IsOptional } from 'class-validator';
import { BadRequestError, Body, Get, JsonController, Param, Post, Put } from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { Role } from '../../models/role.model';
import { RoleService } from '../services/role.service';

// Initialize role service
const roleService = new RoleService();

// Base role class with common properties
class BaseRole {
    @IsNotEmpty()
    public name!: string;

    @IsOptional()
    public description!: string;

    @IsBoolean()
    public enabled!: boolean;
}

// Role response class extending base role
export class RoleResponse extends BaseRole {
    @IsNumber()
    public id!: number;

    @ValidateNested()
    public role!: RoleResponse;

}

// Create role body class with base role properties
class CreateRoleBody extends BaseRole {
    @IsNotEmpty()
    public name: string = '';

    @IsNotEmpty()
    public description: string = '';

    @IsBoolean()
    public enabled: boolean = false;
}

interface UpdateUserRolesRequest {
    roleIds: string[];
}

// Controller for role endpoints
@JsonController('/api/v1/role')
export class RoleController {

    constructor() {
    }

    /**
     * Endpoint to create a new role
     * @param body Role data to create
     * @returns Created role
     */
    @Post()
    @ResponseSchema(RoleResponse)
    public async create(@Body() body: CreateRoleBody): Promise<Role> {
        const role = new Role();
        role.name = body.name;
        role.description = body.description;
        role.enabled = body.enabled;
        return await roleService.create(role);
    }

    /**
     * Endpoint to bootstrap roles
     * @returns Success message
     */
    @Post('/bootstrap')
    @ResponseSchema(RoleResponse)
    public async bootstrap(): Promise<object> {
        return await roleService.bootstrap();
    }

    /**
     * Endpoint to get a role by name
     * @param name Name of the role to retrieve
     * @returns Retrieved role
     */
    @Get('/:name')
    @ResponseSchema(RoleResponse)
    public async get(@Param('name') name: string): Promise<Role | null> {
        return await roleService.get(name);
    }

    /**
     * Endpoint to update a role
     * @param id ID of the role to update
     * @param body Updated role data
     * @returns Updated role
     */
    @Put('/:id')
    @ResponseSchema(RoleResponse)
    public async update(@Param('id') id: string, @Body() body: BaseRole): Promise<object> {
        const role = new Role();
        role.name = body.name;
        role.description = body.description;
        role.enabled = body.enabled;
        return await roleService.update(id, role);
    }

    /**
     * Endpoint to update roles for a particular user
     * @param userId ID of the user to update roles for
     * @param roleIds Array of role IDs to assign to the user
     * @returns Success message
     */
    @Put('/:userId/updateRoles')
    public async updateUserRoles(
        @Param('userId') userId: string,
        @Body() requestBody: UpdateUserRolesRequest
    ): Promise<object> {
        try {
            const roleIds: string[] = requestBody.roleIds; // Extract roleIds from the request body
    
            await roleService.updateUserRoles(userId, roleIds);
            return { success: true, message: 'User roles updated successfully' };
        } catch (error) {
            throw new BadRequestError('Failed to update user roles');
        }
    }    
}
