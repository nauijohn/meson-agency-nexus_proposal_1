import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { ClsService } from "nestjs-cls";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TOTAL_KEY } from "../common/bases";
import { applyPaginationAndSorting } from "../common/utils/repository.pagination";
import { CreateClientDto, UpdateClientDto } from "./dto";
import { QueryClientDto } from "./dto/query-client.dto";
import { Client } from "./entities/client.entity";

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cls: ClsService,
  ) {}

  async create(dto: CreateClientDto): Promise<Client> {
    const entity = this.mapper.map(dto, CreateClientDto, Client);
    return this.repository.save(entity);
  }

  async findAll(query: QueryClientDto): Promise<Client[]> {
    const [entities, total] = await this.repository.findAndCount({
      relations: { contacts: false },
      ...applyPaginationAndSorting(query),
    });

    this.cls.set(TOTAL_KEY, total);

    return entities;
  }

  findOne(id: string): Promise<Client | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        campaigns: true,
      },
    });
  }

  async update(entity: Client, dto: UpdateClientDto): Promise<Client> {
    this.mapper.mutate(dto, entity, UpdateClientDto, Client);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
