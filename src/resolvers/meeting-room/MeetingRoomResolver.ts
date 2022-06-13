import { Ctx, Query, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { isAuth, ApiContext } from "../../middleware";
import { MeetingRoomRepository } from "../../repositories";

@Service()
export class MeetingRoomResolver {
  private readonly roomRepo: MeetingRoomRepository;

  constructor(
    @InjectRepository()
    public meetingRoomRepo: MeetingRoomRepository
  ) {
    this.roomRepo = meetingRoomRepo;
  }
  @Query(() => String)
  @UseMiddleware(isAuth)
  async getMeetingRooms(@Ctx() { identity }: ApiContext): Promise<string> {
    console.log(identity);
    const meetingRooms = await this.roomRepo.getMeetingRooms([]);
    console.log(meetingRooms);
    return "hello world";
  }
}
