import { ReservationService } from "../../services";
import { Query, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { isAuth } from "../../middleware";

@Service()
export class ReservationResolver {
  private readonly rService: ReservationService;

  constructor(public reservationService: ReservationService) {
    this.rService = reservationService;
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async deleteAllReservations(): Promise<string> {
    await this.rService.deleteAllReservations();
    return "Done";
  }
}
