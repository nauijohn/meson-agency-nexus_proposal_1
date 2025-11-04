import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Client } from "./client.entity";
import { UpdateClientDto } from "./dto";

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>,
  ) {}

  async create(dto: Partial<Client>): Promise<Client> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findAll(): Promise<Client[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<Client | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async update(entity: Client, dto: UpdateClientDto): Promise<Client> {
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
