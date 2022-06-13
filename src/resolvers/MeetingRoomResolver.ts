import { Query } from "type-graphql";

export class MeetingRoomResolver {
  @Query(() => String)
  async getMeetingRooms(): Promise<string> {
    return "hello world";
  }
}
