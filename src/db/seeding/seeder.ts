import { Factory, Seeder } from "typeorm-seeding";
import { Connection } from "typeorm";
import { MeetingRoom } from "../../entities";
import { createMeetingRooms } from "./helper";

export default class InitialDatabaseSeed implements Seeder {
  public async run(_: Factory, connection: Connection): Promise<void> {
    const meetingRooms = createMeetingRooms();
    await connection
      .getRepository(MeetingRoom)
      .createQueryBuilder()
      .insert()
      .into(MeetingRoom)
      .values(meetingRooms)
      .execute();
  }
}
