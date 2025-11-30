import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { ClsService } from "nestjs-cls";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TOTAL_KEY } from "../common/bases";
import {
  applyPaginationAndSorting,
} from "../common/utils/repository.pagination";
import { CreateFlowStepDto } from "./dto/create-flow-step.dto";
import { QueryFlowStepDto } from "./dto/query-flow-step.dto";
import { UpdateFlowStepDto } from "./dto/update-flow-step.dto";
import { FlowStep } from "./entities/flow-step.entity";

@Injectable()
export class FlowStepsService {
  constructor(
    @InjectRepository(FlowStep)
    private readonly repository: Repository<FlowStep>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cls: ClsService,
  ) {}

  async create(dto: CreateFlowStepDto): Promise<FlowStep> {
    const entity = this.mapper.map(dto, CreateFlowStepDto, FlowStep);
    return this.repository.save(entity);
  }

  async findAll(query: QueryFlowStepDto): Promise<FlowStep[]> {
    const [entities, total] = await this.repository.findAndCount({
      ...applyPaginationAndSorting(query),
    });

    this.cls.set(TOTAL_KEY, total);

    return entities;
  }

  async findOne(id: string): Promise<FlowStep> {
    return this.repository.findOneOrFail({ where: { id } });
  }

  async update(entity: FlowStep, dto: UpdateFlowStepDto): Promise<FlowStep> {
    this.mapper.mutate(dto, entity, UpdateFlowStepDto, FlowStep);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
