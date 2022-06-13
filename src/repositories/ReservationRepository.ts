import { Reservation } from "../entities";
import { Repository, EntityRepository } from "typeorm";
import { Service } from "typedi";

@Service()
@EntityRepository(Reservation)
export class ReservationRepository extends Repository<Reservation> {
  async deleteAllReservations(): Promise<void> {
    throw new Error("Not implemented");
  }
}
