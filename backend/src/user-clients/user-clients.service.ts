import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { ClsService } from "nestjs-cls";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TOTAL_KEY } from "../common/bases";
import { applyPaginationAndSorting } from "../common/utils/repository.pagination";
import { CreateUserClientDto } from "./dto/create-user-client.dto";
import { QueryUserClientDto } from "./dto/query-user-client.dto";
import { UserClient } from "./entities/user-client.entity";

@Injectable()
export class UserClientsService {
  constructor(
    @InjectRepository(UserClient)
    private readonly repository: Repository<UserClient>,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly cls: ClsService,
  ) {}

  create(dto: CreateUserClientDto): Promise<UserClient> {
    const entity = this.mapper.map(dto, CreateUserClientDto, UserClient);
    return this.repository.save(entity);
  }

  async findAll(query: QueryUserClientDto): Promise<UserClient[]> {
    const [entities, total] = await this.repository.findAndCount({
      ...applyPaginationAndSorting(query, "assignedDate"),
    });

    this.cls.set(TOTAL_KEY, total);

    return entities;
  }

  findOne(userId: string, clientId: string): Promise<UserClient | null> {
    return this.repository.findOne({ where: { clientId, userId } });
  }
}
