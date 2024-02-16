import { MigrationInterface, QueryRunner } from "typeorm";

export class TaskModelChange1708088123388 implements MigrationInterface {
    name = 'TaskModelChange1708088123388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "address" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "address"`);
    }

}
