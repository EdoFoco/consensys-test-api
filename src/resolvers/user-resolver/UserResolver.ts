import { Query, UseMiddleware, Ctx } from "type-graphql";
import { Service } from "typedi";
import { ApiContext, isAuth } from "../../middleware";
import { UserService } from "../../services";
import { UserReservationsResponse } from "./UserResolver.types";

@Service()
export class UserResolver {
  private readonly uService: UserService;

  constructor(public userService: UserService) {
    this.uService = userService;
  }

  @Query(() => UserReservationsResponse)
  @UseMiddleware(isAuth)
  async getCurrentUserReservations(
    @Ctx() { identity }: ApiContext
  ): Promise<UserReservationsResponse> {
    const reservations = await this.uService.getCurrentUserReservations(
      identity.sub
    );
    return { reservations };
  }
}
