import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { ClsService } from "nestjs-cls";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TOTAL_KEY } from "../common/bases";
import { applyPaginationAndSorting } from "../common/utils/repository.pagination";
import { CreateCampaignContactFlowStepDto } from "./dto/create-campaign-contact-flow-step.dto";
import { QueryCampaignContactFlowStepDto } from "./dto/query-campaign-contact-flow-step.dto";
import { UpdateCampaignContactFlowStepDto } from "./dto/update-campaign-contact-flow-step.dto";
import { CampaignContactFlowStep } from "./entities/campaign-contact-flow-step.entity";

@Injectable()
export class CampaignContactFlowStepsService {
  constructor(
    @InjectRepository(CampaignContactFlowStep)
    private readonly repository: Repository<CampaignContactFlowStep>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cls: ClsService,
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

  async findAll(
    query: QueryCampaignContactFlowStepDto,
  ): Promise<CampaignContactFlowStep[]> {
    const [entities, total] = await this.repository.findAndCount({
      ...applyPaginationAndSorting(query),
    });

    this.cls.set(TOTAL_KEY, total);

    return entities;
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
