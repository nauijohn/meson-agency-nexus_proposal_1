import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateFlowActivityDto } from "./dto/create-flow-activity.dto";
import { UpdateFlowActivityDto } from "./dto/update-flow-activity.dto";
import { FlowActivity } from "./entities/flow-activity.entity";

@Injectable()
export class FlowActivitiesService {
  constructor(
    @InjectRepository(FlowActivity)
    private readonly repository: Repository<FlowActivity>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async create(dto: CreateFlowActivityDto): Promise<FlowActivity> {
    const entity = this.mapper.map(dto, CreateFlowActivityDto, FlowActivity);
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
    this.mapper.mutate(dto, entity, UpdateFlowActivityDto, FlowActivity);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
