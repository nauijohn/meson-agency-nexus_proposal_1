import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { ClsService } from "nestjs-cls";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TOTAL_KEY } from "../common/bases";
import { applyPaginationAndSorting } from "../common/utils/repository.pagination";
import { CreateCampaignContactDto } from "./dto/create-campaign-contact.dto";
import { QueryCampaignContactDto } from "./dto/query-campaign-contact.dto";
import { UpdateCampaignContactDto } from "./dto/update-campaign-contact.dto";
import { CampaignContact } from "./entities/campaign-contact.entity";

@Injectable()
export class CampaignContactsService {
  constructor(
    @InjectRepository(CampaignContact)
    private readonly repository: Repository<CampaignContact>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cls: ClsService,
  ) {}

  create(dto: CreateCampaignContactDto): Promise<CampaignContact> {
    const entity = this.mapper.map(
      dto,
      CreateCampaignContactDto,
      CampaignContact,
    );
    console.log("Creating CampaignContact entity:", entity);
    return this.repository.save(entity);
  }

  async findAll(query: QueryCampaignContactDto): Promise<CampaignContact[]> {
    const [entities, total] = await this.repository.findAndCount({
      relations: {
        campaignFlowStep: true,
        campaign: {
          campaignFlowSteps: true,
        },
      },
      where: {
        campaign: {
          client: {
            employeeClients: {
              employeeId: "2e2268bd-ef2f-431a-8c8f-6a15785ea219",
            },
          },
        },
      },
      ...applyPaginationAndSorting(query, "startedAt", "DESC"),
    });

    this.cls.set(TOTAL_KEY, total);

    return entities;
  }

  async findOne(id: string): Promise<CampaignContact> {
    return this.repository.findOneOrFail({
      where: { id },
    });
  }

  async update(
    entity: CampaignContact,
    dto: UpdateCampaignContactDto,
  ): Promise<CampaignContact> {
    this.mapper.mutate(dto, entity, UpdateCampaignContactDto, CampaignContact);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
