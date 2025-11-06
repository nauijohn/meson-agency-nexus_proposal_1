import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateFlowStepActivityDto } from "./dto/create-flow-step-activity.dto";
import { UpdateFlowStepActivityDto } from "./dto/update-flow-step-activity.dto";
import { FlowStepActivity } from "./entities/flow-step-activity.entity";

@Injectable()
export class FlowStepActivitiesService {
  constructor(
    @InjectRepository(FlowStepActivity)
    private readonly repository: Repository<FlowStepActivity>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async create(dto: CreateFlowStepActivityDto): Promise<FlowStepActivity> {
    const entity = this.mapper.map(
      dto,
      CreateFlowStepActivityDto,
      FlowStepActivity,
    );
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
    this.mapper.mutate(
      dto,
      entity,
      UpdateFlowStepActivityDto,
      FlowStepActivity,
    );
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
