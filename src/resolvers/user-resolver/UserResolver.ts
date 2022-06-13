import { Query, UseMiddleware, Ctx } from "type-graphql";
import { Service } from "typedi";
import { ApiContext, isAuth } from "../../middleware";
import { UserService } from "../../services";
import { UserResponse } from "./UserResolver.types";

@Service()
export class UserResolver {
  private readonly uService: UserService;

  constructor(public userService: UserService) {
    this.uService = userService;
  }

  @Query(() => UserResponse)
  @UseMiddleware(isAuth)
  async getCurrentUser(@Ctx() { identity }: ApiContext): Promise<UserResponse> {
    const user = await this.uService.getOrCreateUserByAuthId(identity.sub);
    return { user };
  }
}
