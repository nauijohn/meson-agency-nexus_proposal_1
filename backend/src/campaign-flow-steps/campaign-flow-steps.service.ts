import { ClsService } from "nestjs-cls";
import {
  DeepPartial,
  Repository,
} from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TOTAL_KEY } from "../common/bases/dto/pagination.dto";
import {
  applyPaginationAndSorting,
} from "../common/utils/repository.pagination";
import { QueryCampaignFlowStepDto } from "./dto/query-campaign-flow-step.dto";
import { UpdateCampaignFlowStepDto } from "./dto/update-campaign-flow-step.dto";
import { CampaignFlowStep } from "./entities/campaign-flow-step.entity";

@Injectable()
export class CampaignFlowStepsService {
  constructor(
    @InjectRepository(CampaignFlowStep)
    private readonly repository: Repository<CampaignFlowStep>,
    private readonly cls: ClsService,
  ) {}

  async create(dto: DeepPartial<CampaignFlowStep>): Promise<CampaignFlowStep> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  async findAll(query: QueryCampaignFlowStepDto): Promise<CampaignFlowStep[]> {
    const [entities, total] = await this.repository.findAndCount({
      ...applyPaginationAndSorting(query, "dueAt"),
    });

    this.cls.set(TOTAL_KEY, total);

    return entities;
  }

  async findOne(id: string): Promise<CampaignFlowStep> {
    return await this.repository.findOneOrFail({
      where: { id },
    });
  }

  async update(
    entity: CampaignFlowStep,
    dto: UpdateCampaignFlowStepDto,
  ): Promise<CampaignFlowStep> {
    Object.assign(entity, dto);

    const updated = await this.repository.save(entity);

    return updated;
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
