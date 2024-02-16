import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAndTaskModelChange1708087256534 implements MigrationInterface {
    name = 'UserAndTaskModelChange1708087256534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "task" ADD "name" character varying`);
    }

}
