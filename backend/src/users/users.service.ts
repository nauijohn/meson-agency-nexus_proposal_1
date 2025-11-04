import { DeepPartial, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Client } from "../clients/client.entity";
import { UpdateUserDto } from "./dto";
import { QueryUserDto } from "./dto/query-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async create(dto: DeepPartial<User>): Promise<User> {
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
      .where("user.id = :id", { id })
      .leftJoinAndSelect("user.refreshToken", "refreshToken");

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

  update(entity: User, dto: UpdateUserDto): Promise<User> {
    let refreshToken: { token: string } | undefined = undefined;
    if (dto.refreshToken) {
      refreshToken = { ...entity.refreshToken, token: dto.refreshToken };
    }

    Object.assign(entity, {
      ...dto,
      ...(refreshToken && { refreshToken }),
    });

    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }
}
