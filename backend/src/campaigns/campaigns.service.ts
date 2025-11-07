import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";

import { CampaignAssignedAFlowEvent } from "../common/events/campaign.events";
import { CreateCampaignDto } from "./dto/create-campaign.dto";
import { QueryCampaignDto } from "./dto/query-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";
import { Campaign } from "./entities/campaign.entity";

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly repository: Repository<Campaign>,
    private readonly eventEmitter: EventEmitter2,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async create(dto: CreateCampaignDto): Promise<Campaign> {
    const entity = this.mapper.map(dto, CreateCampaignDto, Campaign);
    return this.repository.save(entity);
  }

  findAll(query?: QueryCampaignDto): Promise<Campaign[]> {
    const qb = this.repository
      .createQueryBuilder("campaign")
      .leftJoinAndSelect("campaign.client", "client")
      .leftJoinAndSelect("campaign.flow", "flow")
      .leftJoinAndSelect("campaign.campaignFlowSteps", "campaignFlowSteps");

    // ✅ Filter: only campaigns with no assigned flow
    if (query?.unassignedFlow) {
      qb.andWhere("campaign.flow_id IS NULL");
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<Campaign> {
    return await this.repository.findOneOrFail({
      where: { id },
      relations: {
        client: true,
        flow: {
          steps: true,
        },
      },
    });
  }

  async update(entity: Campaign, dto: UpdateCampaignDto): Promise<Campaign> {
    this.mapper.mutate(dto, entity, UpdateCampaignDto, Campaign);

    const updated = await this.repository.save(entity);

    console.log("Updated campaign:", updated);

    if (dto.flowId && updated.flow) {
      this.eventEmitter.emit(
        CampaignAssignedAFlowEvent.eventName,
        new CampaignAssignedAFlowEvent({
          campaignId: updated.id,
          flow: {
            id: updated.flow.id,
            flowSteps: dto.campaignFlowSteps,
          },
        }),
      );
    }

    return updated;
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
