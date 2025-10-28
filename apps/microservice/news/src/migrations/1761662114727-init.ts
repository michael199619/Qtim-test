import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1761662114727 implements MigrationInterface {
    name = 'Init1761662114727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "article" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "authorId" uuid NOT NULL, "publishedAt" date, "publishesdAt" date, "status" character varying NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "article"`);
    }

}
