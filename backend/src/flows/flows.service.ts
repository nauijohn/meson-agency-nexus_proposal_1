import { DeepPartial, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UpdateFlowDto } from "./dto/update-flow.dto";
import { Flow } from "./flow.entity";

@Injectable()
export class FlowsService {
  constructor(
    @InjectRepository(Flow)
    private readonly repository: Repository<Flow>,
  ) {}

  async create(dto: DeepPartial<Flow>): Promise<Flow> {
    const entity = this.repository.create(dto);
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

  async findOne(id: string): Promise<Flow | null> {
    return this.repository.findOne({
      where: { id },
      relations: { steps: true },
    });
  }

  async update(entity: Flow, dto: UpdateFlowDto): Promise<Flow> {
    Object.assign(entity, dto);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
