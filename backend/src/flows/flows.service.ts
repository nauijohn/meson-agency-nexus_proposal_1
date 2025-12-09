import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { ClsService } from "nestjs-cls";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TOTAL_KEY } from "../common/bases";
import { applyPaginationAndSorting } from "../common/utils/repository.pagination";
import { CreateFlowDto } from "./dto/create-flow.dto";
import { QueryFlowDto } from "./dto/query-flow.dto";
import { UpdateFlowDto } from "./dto/update-flow.dto";
import { Flow } from "./entities/flow.entity";

@Injectable()
export class FlowsService {
  constructor(
    @InjectRepository(Flow)
    private readonly repository: Repository<Flow>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cls: ClsService,
  ) {}

  async create(dto: CreateFlowDto): Promise<Flow> {
    const entity = this.mapper.map(dto, CreateFlowDto, Flow);
    console.log("CREATED ENTITY:", JSON.stringify(entity, null, 2));
    console.log("CREATED ENTITY:", entity);
    console.log("entity.steps[0]: ", entity.steps[0]);
    return this.repository.save(entity);
  }

  async findAll(query: QueryFlowDto): Promise<Flow[]> {
    const [entities, total] = await this.repository.findAndCount({
      relations: {
        steps: {
          activities: true,
        },
      },
      relationLoadStrategy: "query", // << KEY — enables ordered loading
      order: {
        steps: {
          order: "ASC",
        },
      },
      ...applyPaginationAndSorting(query),
    });

    this.cls.set(TOTAL_KEY, total);

    return entities;
  }

  async findOne(id: string): Promise<Flow> {
    return this.repository.findOneOrFail({
      where: { id },
      relations: { steps: true },
    });
  }

  async update(entity: Flow, dto: UpdateFlowDto): Promise<Flow> {
    this.mapper.mutate(dto, entity, UpdateFlowDto, Flow);
    console.log("UPDATED ENTITY:", entity);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
