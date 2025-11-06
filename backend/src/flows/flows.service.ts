import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateFlowDto } from "./dto/create-flow.dto";
import { UpdateFlowDto } from "./dto/update-flow.dto";
import { Flow } from "./entities/flow.entity";

@Injectable()
export class FlowsService {
  constructor(
    @InjectRepository(Flow)
    private readonly repository: Repository<Flow>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async create(dto: CreateFlowDto): Promise<Flow> {
    const entity = this.mapper.map(dto, CreateFlowDto, Flow);
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

  async findOne(id: string): Promise<Flow> {
    return this.repository.findOneOrFail({
      where: { id },
      relations: { steps: true },
    });
  }

  async update(entity: Flow, dto: UpdateFlowDto): Promise<Flow> {
    this.mapper.mutate(dto, entity, UpdateFlowDto, Flow);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
