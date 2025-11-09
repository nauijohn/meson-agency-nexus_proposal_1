import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { ClsService } from "nestjs-cls";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TOTAL_KEY } from "../common/bases";
import { CampaignEvents } from "../common/events/campaign.events";
import { applyPaginationAndSorting } from "../common/utils/query-builder.pagination";
import { CreateCampaignDto } from "./dto/create-campaign.dto";
import { QueryCampaignDto } from "./dto/query-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";
import { Campaign } from "./entities/campaign.entity";

@Injectable()
export class CampaignsService {
  private readonly events: { event: CampaignEvents; eventPayload?: unknown }[] =
    [];

  constructor(
    @InjectRepository(Campaign)
    private readonly repository: Repository<Campaign>,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly cls: ClsService,
  ) {}

  async create(dto: CreateCampaignDto): Promise<Campaign> {
    const entity = this.mapper.map(dto, CreateCampaignDto, Campaign);
    const savedEntity = await this.repository.save(entity);

    this.events.push({
      event: CampaignEvents.Created,
      eventPayload: { campaign: savedEntity },
    });
    return savedEntity;
  }

  async findAll(query: QueryCampaignDto): Promise<Campaign[]> {
    let qb = this.repository
      .createQueryBuilder("campaign")
      .leftJoinAndSelect("campaign.client", "client")
      .leftJoinAndSelect("campaign.flow", "flow")
      .leftJoinAndSelect("campaign.campaignFlowSteps", "campaignFlowSteps");

    // ✅ Filter: only campaigns with no assigned flow
    if (query?.unassignedFlow) {
      qb.andWhere("campaign.flow_id IS NULL");
    }

    qb = applyPaginationAndSorting(qb, { ...query });

    // Execute query
    const [result, total] = await qb.getManyAndCount();

    // Store total in CLS for interceptor/decorator to access
    this.cls.set(TOTAL_KEY, total);

    return result;
  }

  async findOne(id: string): Promise<Campaign> {
    return await this.repository.findOneOrFail({
      where: { id },
      relations: {
        client: {
          contacts: true,
        },
        flow: {
          steps: true,
        },
      },
    });
  }

  // @AfterAction((result, args) => {
  //   console.log("AfterAction - CampaignsService.update called");
  // })
  async update(entity: Campaign, dto: UpdateCampaignDto): Promise<Campaign> {
    this.mapper.mutate(dto, entity, UpdateCampaignDto, Campaign);

    return await this.repository.save(entity, { data: { dto } });
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
