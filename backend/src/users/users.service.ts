import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Client } from "../clients/client.entity";
import { QueryUserDto } from "./dto/query-user.dto";
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(dto: Partial<User>): Promise<User> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findAll(): Promise<User[]> {
    return this.repository.find({
      // relations: { clients: true },
      relations: ["userClients", "userClients.client"],
    });
  }

  async findOne(id: string, query?: QueryUserDto): Promise<User | null> {
    const qb = this.repository
      .createQueryBuilder("user")
      .where("user.id = :id", { id });

    if (query?.includeClients === true)
      qb.leftJoinAndSelect("user.clients", "client");

    if (query?.includeUnassignedClients === true) {
      qb.leftJoinAndMapMany(
        "user.unassignedClients", // property to map on User
        Client,
        "unassignedClient",
        `unassignedClient.id NOT IN (
          SELECT client_id FROM user_clients WHERE user_id = :id
        )`,
        { id }, // parameter for subquery
      );
    }

    return qb.getOne();
  }

  async update(dto: Partial<User>): Promise<User> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }
}
