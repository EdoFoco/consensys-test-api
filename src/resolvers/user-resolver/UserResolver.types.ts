import { Field, ObjectType } from "type-graphql";
import { User } from "../../entities";

@ObjectType()
export class UserResponse {
  @Field(() => User)
  user: User;
}
