import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { ClsService } from "nestjs-cls";
import { Repository, SelectQueryBuilder } from "typeorm";

import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { JwtUser } from "../auth/entities/jwt-user.entity";
import { TOTAL_KEY } from "../common/bases";
import { CLS_USER } from "../common/constants";
import { applyPaginationAndSorting } from "../common/utils/query-builder.pagination";
import { EmployeeRoleType } from "../employee-roles/entities/employee-role.entity";
import { RoleType } from "../roles/entities";
import { CreateCampaignDto } from "./dto/create-campaign.dto";
import { QueryCampaignDto } from "./dto/query-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";
import { Campaign } from "./entities/campaign.entity";

@Injectable()
export class CampaignsService {
  constructor(
    @InjectRepository(Campaign)
    private readonly repository: Repository<Campaign>,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly cls: ClsService,
  ) {}

  create(dto: CreateCampaignDto): Promise<Campaign> {
    const entity = this.mapper.map(dto, CreateCampaignDto, Campaign);
    return this.repository.save(entity);
  }

  async findAll(query: QueryCampaignDto): Promise<Campaign[]> {
    let qb = this.repository
      .createQueryBuilder("campaign")
      .leftJoinAndSelect("campaign.client", "client")
      .leftJoinAndSelect("client.contacts", "contacts")
      .leftJoinAndSelect("client.employeeClients", "employeeClients") // 👈 important join
      .leftJoinAndSelect("campaign.flow", "flow")
      .leftJoinAndSelect("campaign.campaignFlowSteps", "campaignFlowSteps")
      .leftJoinAndSelect("campaign.campaignContacts", "campaignContacts");

    qb = this.applyRoleFilter(qb);

    // ✅ Filter: only campaigns with no assigned flow
    if (query?.unassignedFlow) {
      qb.andWhere("campaign.flow_id IS NULL");
    }

    if (query?.clientId) {
      qb.andWhere("campaign.client_id = :clientId", {
        clientId: query.clientId,
      });
    }

    qb = applyPaginationAndSorting(qb, { ...query });

    const [result, total] = await qb.getManyAndCount();

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
        campaignFlowSteps: {
          flowStep: true,
        },
      },
    });
  }

  async update(entity: Campaign, dto: UpdateCampaignDto): Promise<Campaign> {
    this.mapper.mutate(dto, entity, UpdateCampaignDto, Campaign);

    return await this.repository.save(entity, { data: { dto } });
  }

  delete(id: string) {
    void this.repository.delete(id);
  }

  private applyRoleFilter(qb: SelectQueryBuilder<Campaign>) {
    const { roles, employeeId, employeeRoles } =
      this.cls.get<JwtUser>(CLS_USER);

    if (
      roles.includes(RoleType.SUPER_ADMIN) ||
      roles.includes(RoleType.ADMIN) ||
      employeeRoles?.includes(EmployeeRoleType.LEAD)
    ) {
      return qb;
    }

    if (roles.includes(RoleType.EMPLOYEE)) {
      qb.andWhere("employeeClients.employee_id = :employeeId", {
        employeeId,
      });
      return qb;
    }

    throw new ForbiddenException("Unknown role.");
  }
}
