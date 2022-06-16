import { MeetingRoom } from "../entities";
import { Repository, EntityRepository } from "typeorm";
import { Service } from "typedi";

@Service()
@EntityRepository(MeetingRoom)
export class MeetingRoomRepository extends Repository<MeetingRoom> {
  async getMeetingRooms(relations?: string[]): Promise<MeetingRoom[]> {
    return await this.find({
      relations: relations ?? [],
      order: { name: "ASC" },
    });
  }

  async getMeetingRoomById(
    id: String,
    relations?: string[]
  ): Promise<MeetingRoom | undefined> {
    return await this.findOne({ where: { id }, relations: relations ?? [] });
  }
}
