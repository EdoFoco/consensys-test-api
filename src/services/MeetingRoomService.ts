import { MeetingRoom } from "../entities";
import { MeetingRoomRepository } from "../repositories";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class MeetingRoomService {
  private mrRepo: MeetingRoomRepository;

  constructor(
    @InjectRepository(MeetingRoom) meetingRoomRepository: MeetingRoomRepository
  ) {
    this.mrRepo = meetingRoomRepository;
  }

  async getMeetingRooms(): Promise<MeetingRoom[]> {
    return await this.mrRepo.getMeetingRooms(["reservations"]);
  }

  async resetMeetingRooms(): Promise<void> {
    await this.mrRepo.deleteAll();

    const rooms: MeetingRoom[] = [];
    for (let i = 1; i <= 10; i++) {
      const room = new MeetingRoom();
      room.name = `C${i < 10 ? `0${i}` : i}`;
      rooms.push(room);
    }
    for (let i = 1; i <= 10; i++) {
      const room = new MeetingRoom();
      room.name = `P${i < 10 ? `0${i}` : i}`;
      rooms.push(room);
    }

    await this.mrRepo.createBulkMeetingRooms(rooms);
  }
}
