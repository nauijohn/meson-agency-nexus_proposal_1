import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { Flow } from "./flow.entity";

@Injectable()
export class FlowsService {
  constructor(
    @InjectRepository(Flow)
    private readonly repository: Repository<Flow>,
  ) {}

  async create(dto: Partial<Flow>): Promise<Flow> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findAll(): Promise<Flow[]> {
    return this.repository.find({
      relations: {
        steps: {
          stepActivities: true,
        },
      },
    });
  }

  async findOne(id: string): Promise<Flow | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(dto: Partial<Flow>): Promise<Flow> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
