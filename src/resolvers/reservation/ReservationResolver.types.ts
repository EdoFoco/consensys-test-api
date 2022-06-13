import { Field, InputType, ObjectType } from "type-graphql";
import { Reservation } from "../../entities";

@InputType()
export class ReservationInput {
  @Field(() => String)
  userId: string;
  @Field(() => String)
  meetingRoomId: string;
  @Field(() => Number)
  startTimeHr: number;
  @Field(() => Number)
  endTimeHr: number;
}

@ObjectType()
export class ReservationResponse {
  @Field(() => Reservation)
  reservation: Reservation;
}
