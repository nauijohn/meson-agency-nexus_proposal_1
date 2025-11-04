import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UpdateFlowStepActivityDto } from "./dto/update-flow-step-activity.dto";
import { FlowStepActivity } from "./flow-step-activity.entity";

@Injectable()
export class FlowStepActivitiesService {
  constructor(
    @InjectRepository(FlowStepActivity)
    private readonly repository: Repository<FlowStepActivity>,
  ) {}

  async create(dto: Partial<FlowStepActivity>): Promise<FlowStepActivity> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findAll(): Promise<FlowStepActivity[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<FlowStepActivity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(
    entity: FlowStepActivity,
    dto: UpdateFlowStepActivityDto,
  ): Promise<FlowStepActivity> {
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
