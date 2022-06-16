import { User } from "../entities/User";
import { Repository, EntityRepository } from "typeorm";
import { Service } from "typedi";

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getUserByAuthId(
    authId: string,
    relations?: string[]
  ): Promise<User | undefined> {
    return await this.findOne({
      where: { authId },
      relations: relations ?? [],
    });
  }

  async createUser(authId: string): Promise<User> {
    return await this.save({ authId });
  }

  async getAll(): Promise<User[]> {
    return await this.find();
  }
}
