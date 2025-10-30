import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Campaign } from "./campaign.entity";

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly repository: Repository<Campaign>,
  ) {}

  async create(dto: Partial<Campaign>): Promise<Campaign> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findAll(): Promise<Campaign[]> {
    return this.repository.find();
  }

  findOne(id: string): Promise<Campaign | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async update(dto: Partial<Campaign>): Promise<Campaign> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
