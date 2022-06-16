import { ReservationService, UserService } from "../../services";
import { Mutation, UseMiddleware, Ctx, Arg } from "type-graphql";
import { Service } from "typedi";
import { isAuth, ApiContext } from "../../middleware";
import {
  ReservationInput,
  ReservationResponse,
} from "./ReservationResolver.types";
import { ForbiddenError } from "type-graphql";

@Service()
export class ReservationResolver {
  private readonly rService: ReservationService;
  private readonly uService: UserService;

  constructor(
    public reservationService: ReservationService,
    public userService: UserService
  ) {
    this.rService = reservationService;
    this.uService = userService;
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async deleteAllReservations(): Promise<string> {
    await this.rService.deleteAllReservations();
    return "Done";
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async deleteReservation(
    @Ctx() { identity }: ApiContext,
    @Arg("reservationId") reservationId: string
  ): Promise<string> {
    const reservations = await this.uService.getCurrentUserReservations(
      identity.sub
    );
    const reservation = reservations.find((r) => r.id === reservationId);

    if (reservation === undefined) throw new ForbiddenError();

    await this.rService.deleteReservation(reservationId);
    return "Done";
  }

  @Mutation(() => ReservationResponse)
  @UseMiddleware(isAuth)
  async createReservationForCurrentUser(
    @Ctx() { identity }: ApiContext,
    @Arg("reservationInput") reservationInput: ReservationInput
  ): Promise<ReservationResponse> {
    const user = await this.uService.getOrCreateUserByAuthId(identity.sub);

    if (user.id !== reservationInput.userId) {
      throw new ForbiddenError();
    }

    const reservation = await this.rService.createReservation(
      reservationInput,
      user.reservations
    );
    return { reservation };
  }
}
