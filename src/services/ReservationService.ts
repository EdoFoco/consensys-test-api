import { ReservationRepository } from "../repositories";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";

@Service()
export class ReservationService {
  private rRepo: ReservationRepository;

  constructor(
    @InjectRepository(ReservationRepository)
    reservationRepository: ReservationRepository
  ) {
    this.rRepo = reservationRepository;
  }
  async deleteAllReservations(): Promise<void> {
    return await this.rRepo.deleteAllReservations();
  }
}
