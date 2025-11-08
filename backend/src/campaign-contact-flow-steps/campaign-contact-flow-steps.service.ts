import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateCampaignContactFlowStepDto } from "./dto/create-campaign-contact-flow-step.dto";
import { UpdateCampaignContactFlowStepDto } from "./dto/update-campaign-contact-flow-step.dto";
import { CampaignContactFlowStep } from "./entities/campaign-contact-flow-step.entity";

@Injectable()
export class CampaignContactFlowStepsService {
  constructor(
    @InjectRepository(CampaignContactFlowStep)
    private readonly repository: Repository<CampaignContactFlowStep>,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  create(
    dto: CreateCampaignContactFlowStepDto,
  ): Promise<CampaignContactFlowStep> {
    const entity = this.mapper.map(
      dto,
      CreateCampaignContactFlowStepDto,
      CampaignContactFlowStep,
    );
    console.log("Creating CampaignContactFlowStep entity:", entity);
    return this.repository.save(entity);
  }

  findAll(): Promise<CampaignContactFlowStep[]> {
    return this.repository.find();
  }

  async findOne(id: string): Promise<CampaignContactFlowStep> {
    return this.repository.findOneOrFail({
      where: { id },
    });
  }

  async update(
    entity: CampaignContactFlowStep,
    dto: UpdateCampaignContactFlowStepDto,
  ): Promise<CampaignContactFlowStep> {
    this.mapper.mutate(
      dto,
      entity,
      UpdateCampaignContactFlowStepDto,
      CampaignContactFlowStep,
    );
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
