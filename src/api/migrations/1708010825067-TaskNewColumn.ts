import { MigrationInterface, QueryRunner } from 'typeorm';

export class TaskNewColumn1708010825067 implements MigrationInterface {
    name = 'TaskNewColumn1708010825067';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE task ADD name character varying NOT NULL');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE task DROP COLUMN name');
    }

}
