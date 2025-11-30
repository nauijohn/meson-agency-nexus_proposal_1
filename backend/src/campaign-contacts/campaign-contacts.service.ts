import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { ClsService } from "nestjs-cls";
import { FindOptionsWhere, Repository } from "typeorm";

import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { JwtUser } from "../auth/entities/jwt-user.entity";
import { TOTAL_KEY } from "../common/bases";
import { CLS_USER } from "../common/constants";
import { applyPaginationAndSorting } from "../common/utils/repository.pagination";
import { EmployeeRoleType } from "../employee-roles/entities/employee-role.entity";
import { RoleType } from "../roles/entities";
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
    return this.repository.save(entity);
  }

  async findAll(query: QueryCampaignContactDto): Promise<CampaignContact[]> {
    const [entities, total] = await this.repository.findAndCount({
      relations: {
        clientContact: true,
      },
      where: { ...this.applyRoleFilter() },
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

  private applyRoleFilter():
    | FindOptionsWhere<CampaignContact>
    | FindOptionsWhere<CampaignContact>[]
    | undefined {
    const user = this.cls.get<JwtUser>(CLS_USER);

    if (
      user.roles.includes(RoleType.SUPER_ADMIN) ||
      user.roles.includes(RoleType.ADMIN) ||
      user.employeeRoles?.includes(EmployeeRoleType.LEAD)
    )
      return {};

    if (user.roles.includes(RoleType.EMPLOYEE))
      return {
        campaign: {
          client: {
            employeeClients: {
              employeeId: user.employeeId,
            },
          },
        },
      };

    throw new ForbiddenException("Unknown role.");
  }
}
