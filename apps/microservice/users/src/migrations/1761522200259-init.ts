import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1761522200259 implements MigrationInterface {
    name = 'Init1761522200259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "password" character varying NOT NULL, "login" character varying NOT NULL, "name" character varying NOT NULL, "isDeleted" boolean, "deletedAt" TIMESTAMP, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
