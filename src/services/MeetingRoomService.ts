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
  async getMeetingRooms(relations?: string[]): Promise<MeetingRoom[]> {
    return await this.mrRepo.getMeetingRooms(relations);
  }
}
