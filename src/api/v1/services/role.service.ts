// Import dependencies
import { Service } from 'typedi';
import { roles as bootstrappedRoles } from '../../bootstrap/role';
import { Role } from '../../models';
import { AppDataSource } from '../../../loaders/typeormLoader';
import logger from '../../../util/logger';

// Get repository
const roleRepository = AppDataSource.getRepository(Role);

// Service class for Role
@Service()
export class RoleService {
	constructor() {}

	// Method to create a new role
	public async create(data: Role): Promise<Role> {
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
	public async update(roleId: number, data: Role): Promise<object> {
		const role = await roleRepository.findOneBy({ id: roleId });
		if (role) {
			const roleObj = { ...role, ...data };
			await roleRepository.save(roleObj);
			return { success: true };
		}
		return { error: '404' };
	}
}
