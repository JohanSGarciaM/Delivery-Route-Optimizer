import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1789444255693 implements MigrationInterface {
    name = 'InitialSchema1789444255693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "deliveries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "placeId" character varying NOT NULL, "address" character varying NOT NULL, "latitude" double precision NOT NULL, "longitude" double precision NOT NULL, "optimizedOrder" integer NOT NULL, "routeId" uuid NOT NULL, CONSTRAINT "PK_a6ef225c5c5f0974e503bfb731f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "routes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "originAddress" character varying NOT NULL, "originLatitude" double precision NOT NULL, "originLongitude" double precision NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_76100511cdfa1d013c859f01d8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "deliveries" ADD CONSTRAINT "FK_5ccb894cf08c2585ec04d1bc382" FOREIGN KEY ("routeId") REFERENCES "routes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "deliveries" DROP CONSTRAINT "FK_5ccb894cf08c2585ec04d1bc382"`);
        await queryRunner.query(`DROP TABLE "routes"`);
        await queryRunner.query(`DROP TABLE "deliveries"`);
    }

}
