import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { ClsService } from "nestjs-cls";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TOTAL_KEY } from "../common/bases/dto/pagination.dto";
import { applyPaginationAndSorting } from "../common/utils/repository.pagination";
import { CreateFlowActivityDto } from "./dto/create-flow-activity.dto";
import { QueryFlowActivityDto } from "./dto/query-flow-activities.dto";
import { UpdateFlowActivityDto } from "./dto/update-flow-activity.dto";
import { FlowActivity } from "./entities/flow-activity.entity";

@Injectable()
export class FlowActivitiesService {
  constructor(
    @InjectRepository(FlowActivity)
    private readonly repository: Repository<FlowActivity>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cls: ClsService,
  ) {}

  async create(dto: CreateFlowActivityDto): Promise<FlowActivity> {
    const entity = this.mapper.map(dto, CreateFlowActivityDto, FlowActivity);
    return this.repository.save(entity);
  }

  async findAll(query: QueryFlowActivityDto): Promise<FlowActivity[]> {
    const [entities, total] = await this.repository.findAndCount({
      ...applyPaginationAndSorting(query),
    });

    this.cls.set(TOTAL_KEY, total);

    return entities;
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
