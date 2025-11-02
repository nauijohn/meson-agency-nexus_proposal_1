import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { FlowStep } from "../flow_steps/flow-step.entity";

@Injectable()
export class FlowStepsService {
  constructor(
    @InjectRepository(FlowStep)
    private readonly repository: Repository<FlowStep>,
  ) {}

  async create(
    dto: Partial<FlowStep>,
    save: boolean = true,
  ): Promise<FlowStep> {
    const entity = this.repository.create(dto);
    if (!save) return entity;
    return this.repository.save(entity);
  }

  findAll(): Promise<FlowStep[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<FlowStep | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(dto: Partial<FlowStep>): Promise<FlowStep> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
