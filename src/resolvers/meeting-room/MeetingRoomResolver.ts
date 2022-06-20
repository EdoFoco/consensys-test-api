import { MeetingRoomService } from "../../services";
import { Mutation, Query, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { isAuth } from "../../middleware";
import { MeetingRoomsResponse } from "./MeetingRoomResolver.types";

@Service()
export class MeetingRoomResolver {
  private readonly mrService: MeetingRoomService;

  constructor(public meetingRoomService: MeetingRoomService) {
    this.mrService = meetingRoomService;
  }

  @Query(() => MeetingRoomsResponse)
  @UseMiddleware(isAuth)
  async getMeetingRooms(): Promise<MeetingRoomsResponse> {
    const meetingRooms = await this.mrService.getMeetingRooms();
    return { meetingRooms };
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async resetMeetingRooms(): Promise<string> {
    await this.mrService.resetMeetingRooms();
    return "Done";
  }
}
