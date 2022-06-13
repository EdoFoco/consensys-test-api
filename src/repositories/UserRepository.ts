import { User } from "../entities/User";
import { Repository, EntityRepository } from "typeorm";
import { Service } from "typedi";

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findOrCreateByAuthId(
    authId: string,
    relations?: string[]
  ): Promise<User> {
    let user = await this.findOne({
      where: { authId },
      relations: relations ?? [],
    });

    if (!user) {
      user = await this.save({ authId });
    }

    return user;
  }

  async getAll(): Promise<User[]> {
    return await this.find();
  }
}
