import { Field, ObjectType } from "type-graphql";
import { Reservation } from "../../entities";

@ObjectType()
export class UserReservationsResponse {
  @Field(() => [Reservation])
  reservations: Reservation[];
}
