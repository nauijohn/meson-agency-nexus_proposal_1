import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UpdateFlowStepDto } from "./dto/update-flow-step.dto";
import { FlowStep } from "./entities/flow-step.entity";

@Injectable()
export class FlowStepsService {
  constructor(
    @InjectRepository(FlowStep)
    private readonly repository: Repository<FlowStep>,
  ) {}

  async create(dto: Partial<FlowStep>): Promise<FlowStep> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findAll(): Promise<FlowStep[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<FlowStep | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(entity: FlowStep, dto: UpdateFlowStepDto): Promise<FlowStep> {
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
