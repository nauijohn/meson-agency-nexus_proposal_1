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
import { CreateClientDto, UpdateClientDto } from "./dto";
import { QueryClientDto } from "./dto/query-client.dto";
import { Client } from "./entities/client.entity";

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client) private readonly repository: Repository<Client>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cls: ClsService,
  ) {}

  async create(dto: CreateClientDto): Promise<Client> {
    const entity = this.mapper.map(dto, CreateClientDto, Client);
    return this.repository.save(entity);
  }

  async findAll(query: QueryClientDto): Promise<Client[]> {
    const [entities, total] = await this.repository.findAndCount({
      where: this.applyRoleFilter(),
      relations: {
        contacts: true,
        campaigns: true,
      },
      ...applyPaginationAndSorting(query),
    });

    this.cls.set(TOTAL_KEY, total);

    return entities;
  }

  findOne(id: string): Promise<Client | null> {
    return this.repository.findOne({
      where: {
        id,
        ...this.applyRoleFilter(),
      },
      relations: {
        campaigns: true,
        contacts: true,
        user: true,
      },
    });
  }

  async update(entity: Client, dto: UpdateClientDto): Promise<Client> {
    this.mapper.mutate(dto, entity, UpdateClientDto, Client);
    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }

  private applyRoleFilter():
    | FindOptionsWhere<Client>
    | FindOptionsWhere<Client>[]
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
        user: {
          employee: {
            id: user.employeeId,
          },
        },
      };

    throw new ForbiddenException("Unknown role.");
  }
}
