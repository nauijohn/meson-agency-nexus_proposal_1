import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { ClsService } from "nestjs-cls";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TOTAL_KEY } from "../common/bases";
import { applyPaginationAndSorting } from "../common/utils/repository.pagination";
import { CreateClientContactDto } from "./dto/create-client-contact.dto";
import { QueryClientContactDto } from "./dto/query-client-contact.dto";
import { UpdateClientContactDto } from "./dto/update-client-contact.dto";
import { ClientContact } from "./entities/client-contact.entity";

@Injectable()
export class ClientContactsService {
  constructor(
    @InjectRepository(ClientContact)
    private readonly repository: Repository<ClientContact>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cls: ClsService,
  ) {}

  async create(dto: CreateClientContactDto): Promise<ClientContact> {
    const entity = this.mapper.map(dto, CreateClientContactDto, ClientContact);
    return this.repository.save(entity);
  }

  async findAll(query: QueryClientContactDto): Promise<ClientContact[]> {
    const [entities, total] = await this.repository.findAndCount({
      relations: {
        clients: true,
      },
      ...applyPaginationAndSorting(query),
    });

    this.cls.set(TOTAL_KEY, total);

    return entities;
  }

  async findOne(id: string): Promise<ClientContact> {
    return this.repository.findOneOrFail({
      where: { id },
    });
  }

  async update(
    entity: ClientContact,
    dto: UpdateClientContactDto,
  ): Promise<ClientContact> {
    this.mapper.mutate(dto, entity, UpdateClientContactDto, ClientContact);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
