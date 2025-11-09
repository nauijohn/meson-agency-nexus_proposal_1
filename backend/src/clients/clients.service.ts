import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateClientDto, UpdateClientDto } from "./dto";
import { Client } from "./entities/client.entity";

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async create(dto: CreateClientDto): Promise<Client> {
    const entity = this.mapper.map(dto, CreateClientDto, Client);
    return this.repository.save(entity);
  }

  findAll(): Promise<Client[]> {
    return this.repository.find();
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
