import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAddressRemove1708087405207 implements MigrationInterface {
    name = 'UserAddressRemove1708087405207'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying`);
    }

}
