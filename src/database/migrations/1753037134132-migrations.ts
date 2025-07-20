import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1753037134132 implements MigrationInterface {
  name = 'Migrations1753037134132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "clients" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "lastName" varchar NOT NULL, "age" integer NOT NULL, "birthDate" datetime NOT NULL, "created" datetime NOT NULL DEFAULT (datetime('now')), "updated" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "clients"`);
  }
}
