import { UserRepository } from "../repositories";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { EntityNotFoundError } from "typeorm";
import { Reservation, User } from "../entities";

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
    const user = await this.uRepo.getUserByAuthId(authId, ["reservations"]);

    if (!user) throw new EntityNotFoundError(User, "authId");

    return user.reservations;
  }

  async getOrCreateUserByAuthId(authId: string): Promise<User> {
    let user = await this.uRepo.getUserByAuthId(authId, [
      "reservations",
      "reservations.meetingRoom",
    ]);

    if (!user) {
      user = await this.uRepo.createUser(authId);
      user = await this.uRepo.getUserByAuthId(authId, [
        "reservations",
        "reservations.meetingRoom",
      ]);
    }

    return user!;
  }
}
