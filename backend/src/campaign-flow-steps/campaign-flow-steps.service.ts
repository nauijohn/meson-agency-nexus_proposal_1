import { DeepPartial, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { UpdateCampaignFlowStepDto } from "./dto/update-campaign-flow-step.dto";
import { CampaignFlowStep } from "./entities/campaign-flow-step.entity";

@Injectable()
export class CampaignFlowStepsService {
  constructor(
    @InjectRepository(CampaignFlowStep)
    private readonly repository: Repository<CampaignFlowStep>,
  ) {}

  async create(dto: DeepPartial<CampaignFlowStep>): Promise<CampaignFlowStep> {
    const entity = this.repository.create(dto);
    return this.repository.save(entity);
  }

  findAll(): Promise<CampaignFlowStep[]> {
    return this.repository.find({
      relations: {
        campaign: {
          client: {
            campaigns: false,
          },
        },
        flowStep: true,
      },
    });
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
