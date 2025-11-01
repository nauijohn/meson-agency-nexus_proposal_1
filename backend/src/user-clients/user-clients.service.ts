import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UserClient } from "./user-client.entity";

@Injectable()
export class UserClientsService {
  constructor(
    @InjectRepository(UserClient)
    private readonly repository: Repository<UserClient>,
  ) {}

  create(dto: Partial<UserClient>): Promise<UserClient> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findAll(): Promise<UserClient[]> {
    return this.repository.find();
  }

  findOne(userId: string, clientId: string): Promise<UserClient | null> {
    return this.repository.findOne({ where: { clientId, userId } });
  }
}
