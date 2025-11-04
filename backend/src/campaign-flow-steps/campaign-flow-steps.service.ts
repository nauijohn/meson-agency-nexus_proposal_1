import { DeepPartial, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CampaignFlowStep } from "./campaign-flow-step.entity";

@Injectable()
export class CampaignFlowStepsService {
  constructor(
    @InjectRepository(CampaignFlowStep)
    private readonly repository: Repository<CampaignFlowStep>,
  ) {}

  async create(dto: DeepPartial<CampaignFlowStep>): Promise<CampaignFlowStep> {
    console.log("Creating campaign flow step with dto:", dto);
    const entity = this.repository.create(dto);
    console.log("Creating campaign flow step:", entity);
    return this.repository.save(entity);
  }

  findAll(): Promise<CampaignFlowStep[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<CampaignFlowStep> {
    return await this.repository.findOneOrFail({
      where: { id },
    });
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
