import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedContent1761862456854 implements MigrationInterface {
    name = 'AddedContent1761862456854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" ADD "content" text NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "article" DROP COLUMN "content"`);
    }

}
