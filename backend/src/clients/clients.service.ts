import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Client } from "./client.entity";
import { QueryClientDto } from "./dto/query-client.dto";

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

  findAll(query?: QueryClientDto): Promise<Client[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<Client | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async update(dto: Partial<Client>): Promise<Client> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
