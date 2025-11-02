import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { FlowActivity } from "./flow-activity.entity";

@Injectable()
export class FlowActivitiesService {
  constructor(
    @InjectRepository(FlowActivity)
    private readonly repository: Repository<FlowActivity>,
  ) {}

  async create(
    dto: Partial<FlowActivity>,
    save: boolean = true,
  ): Promise<FlowActivity> {
    const entity = this.repository.create(dto);
    if (!save) return entity;
    return this.repository.save(entity);
  }

  findAll(): Promise<FlowActivity[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<FlowActivity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(dto: Partial<FlowActivity>): Promise<FlowActivity> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
