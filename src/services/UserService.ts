import { UserRepository } from "../repositories";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Reservation } from "src/entities";

@Service()
export class UserService {
  private uRepo: UserRepository;

  constructor(
    @InjectRepository(UserRepository)
    userRepository: UserRepository
  ) {
    this.uRepo = userRepository;
  }

  async getCurrentUserReservations(authId: string): Promise<Reservation[]> {
    const user = await this.uRepo.findOrCreateByAuthId(authId);
    return user.reservations;
  }
}
