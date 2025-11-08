import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateClientContactDto } from "./dto/create-client-contact.dto";
import { UpdateClientContactDto } from "./dto/update-client-contact.dto";
import { ClientContact } from "./entities/client-contact.entity";

@Injectable()
export class ClientContactsService {
  constructor(
    @InjectRepository(ClientContact)
    private readonly repository: Repository<ClientContact>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async create(dto: CreateClientContactDto): Promise<ClientContact> {
    const entity = this.mapper.map(dto, CreateClientContactDto, ClientContact);
    return this.repository.save(entity);
  }

  findAll(): Promise<ClientContact[]> {
    return this.repository.find({
      relations: {
        clients: true,
      },
    });
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
