import { MeetingRoomService } from "../../services";
import { Ctx, Query, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { isAuth, ApiContext } from "../../middleware";

@Service()
export class MeetingRoomResolver {
  private readonly mrService: MeetingRoomService;

  constructor(public meetingRoomService: MeetingRoomService) {
    this.mrService = meetingRoomService;
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async getMeetingRooms(@Ctx() { identity }: ApiContext): Promise<string> {
    console.log(identity);
    const meetingRooms = await this.mrService.getMeetingRooms();
    console.log(meetingRooms);
    return "hello world";
  }
}
