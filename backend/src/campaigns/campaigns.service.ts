import { DeepPartial, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { InjectRepository } from "@nestjs/typeorm";

import { CampaignAssignedToFlowEvent } from "../common/events/campaign.events";
import { Campaign } from "./campaign.entity";
import { QueryCampaignDto } from "./dto/query-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly repository: Repository<Campaign>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: DeepPartial<Campaign>): Promise<Campaign> {
    const entity = this.repository.create(dto);
    console.log("Creating campaign2:", entity);
    return this.repository.save(entity);
  }

  findAll(query?: QueryCampaignDto): Promise<Campaign[]> {
    // return this.repository.find({
    //   relations: {
    //     client: true,
    //     flow: true,
    //   },
    // });
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
    Object.assign(entity, dto);

    let flow: { id: string } | undefined = undefined;
    if (dto.flowId) flow = { id: dto.flowId };

    const updated = await this.repository.save({
      ...entity,
      ...(flow && { flow: { id: dto.flowId } }),
    });

    console.log("Updated campaign:", updated);

    if (flow)
      this.eventEmitter.emit(
        CampaignAssignedToFlowEvent.eventName,
        new CampaignAssignedToFlowEvent(updated.id, updated.flow?.id || ""),
      );

    return updated;
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
