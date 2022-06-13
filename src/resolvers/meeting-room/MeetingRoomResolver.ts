import { Ctx, Query, UseMiddleware } from "type-graphql";
import { isAuth, ApiContext } from "../../middleware";

export class MeetingRoomResolver {
  @Query(() => String)
  @UseMiddleware(isAuth)
  async getMeetingRooms(@Ctx() { identity }: ApiContext): Promise<string> {
    console.log(identity);
    return "hello world";
  }
}
