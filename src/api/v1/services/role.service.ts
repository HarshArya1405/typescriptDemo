// Import dependencies
import { Service } from 'typedi';
import { roles as bootstrappedRoles } from '../../bootstrap/role';
import { Role, User } from '../../models';
import { AppDataSource } from '../../../loaders/typeormLoader';
import logger from '../../../util/logger';

// Get repository
const roleRepository = AppDataSource.getRepository(Role);
const userRepository = AppDataSource.getRepository(User);

// Service class for Role
@Service()
export class RoleService {
	constructor() {}

	// Method to create a new role
	public async create(data: Role): Promise<Role> {
		logger.info(`[RoleService][create]  - ${JSON.stringify(data)}`);
		const role = new Role();
		role.name = data.name;
		role.description = data.description;
		role.enabled = data.enabled;
		await roleRepository.save(role);
		return role;
	}

	// Method to bootstrap roles from predefined list
	public async bootstrap(): Promise<object> {
		const roles = bootstrappedRoles;
		for (const role of roles) {
			const existRole = await this.get(role.name);
			if (existRole) {
				logger.info(JSON.stringify(existRole));
			} else {
				const newRole = new Role();
				newRole.name = role.name;
				newRole.description = role.description;
				newRole.enabled = role.enabled;
				logger.info('existRole', newRole);
				await this.create(newRole);
			}
		}
		return { success: true };
	}

	// Method to get a role by name
	public async get(rolename: string): Promise<Role | null> {
		const role = await roleRepository.findOneBy({ name: rolename });
		return role ? role : null;
	}

	// Method to update a role
	public async update(roleId: string, data: Role): Promise<object> {
		logger.info(`[RoleService][update]  - ${JSON.stringify(data)}`);
		const role = await roleRepository.findOneBy({ id: roleId });
		if (role) {
			const roleObj = { ...role, ...data };
			await roleRepository.save(roleObj);
			return { success: true };
		}
		return { error: '404' };
	}

	// Method to update roles for a particular user
	public async updateUserRoles(userId: string, roleIds: string[] ): Promise<void> {
		// Find the user with associated roles
		const user = await userRepository.findOne({ where: { id: userId }, relations: ['roles'] });
	
		if (!user) {
			throw new Error(`User with ID ${userId} not found`);
		}
	
		// Log the provided role IDs
		console.log('Provided role IDs:', roleIds);
	
		// Check if roleIds array is empty
		if (roleIds.length === 0) {
			console.log('No role IDs provided');
			return; // or handle the situation appropriately
		}
	
		// Fetch roles with the provided role IDs
		const rolesToAdd: Role[] = [];
		for (const roleId of roleIds) {
			console.log('Checking role ID:', roleId);
			const existingRole = user.roles.find(role => role.id === roleId);
			console.log('Existing role:', existingRole);
	
			if (!existingRole) {
				console.log('Role not found in users roles, adding new role');
				const newRole = new Role();
				newRole.id = roleId;
				rolesToAdd.push(newRole);
			}
		}
	
		console.log('Roles to add:', rolesToAdd);
	
		// Append new roles to existing ones
		user.roles = [...user.roles, ...rolesToAdd];
	
		// Save the updated user
		await userRepository.save(user);
	}	
}
