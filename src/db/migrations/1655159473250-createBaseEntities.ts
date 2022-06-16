import {MigrationInterface, QueryRunner} from "typeorm";

export class createBaseEntities1655159473250 implements MigrationInterface {
    name = 'createBaseEntities1655159473250'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "authId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ad5065ee18a722baaa932d1c3c" ON "user" ("authId") `);
        await queryRunner.query(`CREATE TABLE "reservation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "meetingRoomId" uuid NOT NULL, "startTimeHr" integer NOT NULL, "endTimeHr" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e2b35679bbbd5c56e730269b045" PRIMARY KEY ("id", "userId", "meetingRoomId"))`);
        await queryRunner.query(`CREATE TABLE "meeting_room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "reservationIntervalHr" integer NOT NULL DEFAULT '1', "startTimeHr" integer NOT NULL DEFAULT '9', "endTimeHr" integer NOT NULL DEFAULT '20', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b7d15017d9ca3581550483bcc1c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_529dceb01ef681127fef04d755d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reservation" ADD CONSTRAINT "FK_89c87eb7e2270224f21303e32b3" FOREIGN KEY ("meetingRoomId") REFERENCES "meeting_room"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_89c87eb7e2270224f21303e32b3"`);
        await queryRunner.query(`ALTER TABLE "reservation" DROP CONSTRAINT "FK_529dceb01ef681127fef04d755d"`);
        await queryRunner.query(`DROP TABLE "meeting_room"`);
        await queryRunner.query(`DROP TABLE "reservation"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ad5065ee18a722baaa932d1c3c"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
