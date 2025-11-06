import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateUserClientDto } from "./dto/create-user-client.dto";
import { UserClient } from "./entities/user-client.entity";

@Injectable()
export class UserClientsService {
  constructor(
    @InjectRepository(UserClient)
    private readonly repository: Repository<UserClient>,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  create(dto: CreateUserClientDto): Promise<UserClient> {
    const entity = this.mapper.map(dto, CreateUserClientDto, UserClient);
    return this.repository.save(entity);
  }

  findAll(): Promise<UserClient[]> {
    return this.repository.find();
  }

  findOne(userId: string, clientId: string): Promise<UserClient | null> {
    return this.repository.findOne({ where: { clientId, userId } });
  }
}
