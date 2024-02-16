import { Service } from 'typedi';
import { roles as bootstrappedRoles } from '../bootstrap/role';
import { Role } from '../models';
import { AppDataSource } from '../../loaders/typeormLoader';
import logger from '../../util/logger';

const roleRepository = AppDataSource.getRepository(Role);
@Service()
export class RoleService {
	constructor(
	) { }

	public async create(data: Role): Promise<Role> {
		const role = new Role();
		role.name = data.name;
        role.description = data.description;
        role.enabled = data.enabled;
        await roleRepository.save(role);
		return role;
	}

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
			  logger.info('existRole',newRole); 
			  await this.create(newRole);
			}
		  }
		  return {success:true};
	}

	public async get(rolename: string): Promise<Role | null> {
		const role = await roleRepository.findOneBy({
			name: rolename,
		});
		return (role) ? role : null;	
	}

	public async update(roleId: number,data: Role): Promise<object> {
		const role = await roleRepository.findOneBy({
			id: roleId,
		});
		if(role){
			const roleObj  = {role, ...data};
			await roleRepository.save(roleObj);
			return { success: true };
		}
		return { error: '404' };
	}
}
