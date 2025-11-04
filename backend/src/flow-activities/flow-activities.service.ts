import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UpdateFlowActivityDto } from "./dto/update-flow-activity.dto";
import { FlowActivity } from "./flow-activity.entity";

@Injectable()
export class FlowActivitiesService {
  constructor(
    @InjectRepository(FlowActivity)
    private readonly repository: Repository<FlowActivity>,
  ) {}

  async create(dto: Partial<FlowActivity>): Promise<FlowActivity> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findAll(): Promise<FlowActivity[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<FlowActivity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(
    entity: FlowActivity,
    dto: UpdateFlowActivityDto,
  ): Promise<FlowActivity> {
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
