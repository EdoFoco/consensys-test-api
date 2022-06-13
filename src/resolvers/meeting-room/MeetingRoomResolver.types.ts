import { Field, ObjectType } from "type-graphql";
import { MeetingRoom } from "../../entities";

@ObjectType()
export class MeetingRoomsResponse {
  @Field(() => [MeetingRoom])
  meetingRooms: MeetingRoom[];
}
