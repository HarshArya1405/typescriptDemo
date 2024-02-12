import { EntityRepository, Repository } from 'typeorm';

import { Task } from '../models';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    /**
     * Find by user_id is used for our data-loader to get all needed tasks in one query.
     */
    public findByTaskIds(ids: string[]): Promise<Task[]> {
        return this.createQueryBuilder()
            .select()
            .where(`task.user_id IN (${ids.map(id => `'${id}'`).join(', ')})`)
            .getMany();
    }

}
