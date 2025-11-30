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
import { RolesService } from "../roles/roles.service";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { QueryUserDto } from "./dto/query-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly cls: ClsService,
    private readonly rolesService: RolesService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const entity = this.mapper.map(dto, CreateUserDto, User);

    if (dto.roles && dto.roles.length > 0) {
      dto.roles = Array.from(new Set([...dto.roles, RoleType.USER]));
    } else {
      dto.roles = [RoleType.USER];
    }

    const roles = await this.rolesService.findAll();
    entity.roles = roles.filter((role) => dto.roles?.includes(role.type));

    return this.repository.save(entity, { data: dto });
  }

  async findAll(query: QueryUserDto): Promise<User[]> {
    const [entities, total] = await this.repository.findAndCount({
      relations: {
        employee: true,
        roles: true,
      },
      ...applyPaginationAndSorting(query),
    });

    this.cls.set(TOTAL_KEY, total);

    return entities;
  }

  async findOne(id: string, query?: QueryUserDto): Promise<User | null> {
    // const qb = this.repository
    //   .createQueryBuilder("user")
    //   .where("user.id = :id", { id })
    //   .leftJoinAndSelect("user.refreshToken", "refreshToken")
    //   .leftJoinAndSelect("user.userClients", "userClients")
    //   .leftJoinAndSelect("userClients.client", "client")
    //   .leftJoinAndSelect("client.campaigns", "campaign");

    // if (query?.includeUnassignedClients) {
    //   qb.leftJoinAndMapMany(
    //     "user.unassignedClients",
    //     "Client",
    //     "unassignedClient",
    //     `unassignedClient.id NOT IN (
    //       SELECT uc.client_id FROM user_clients uc WHERE uc.user_id = :id
    //     )`,
    //     { id },
    //   );
    // }

    // return qb.getOne();

    return this.repository.findOneOrFail({
      where: { ...this.applyRoleFilter(id) },
      relations: {
        refreshToken: true,
        employee: true,
        roles: true,
      },
    });
  }

  async update(entity: User, dto: UpdateUserDto): Promise<User> {
    this.mapper.mutate(dto, entity, UpdateUserDto, User);

    if (dto.refreshToken && entity.refreshToken) {
      entity.refreshToken.token = dto.refreshToken;
    }

    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      relations: {
        employee: {
          roles: true,
        },
      },
    });
  }

  private applyRoleFilter(
    id?: string,
  ): FindOptionsWhere<User> | FindOptionsWhere<User>[] | undefined {
    const user = this.cls.get<JwtUser>(CLS_USER);

    if (
      user.roles.includes(RoleType.SUPER_ADMIN) ||
      user.roles.includes(RoleType.ADMIN) ||
      user.employeeRoles?.includes(EmployeeRoleType.LEAD)
    )
      return { id };

    if (user.roles.includes(RoleType.EMPLOYEE)) {
      if (id && id !== user.id) {
        throw new ForbiddenException("Access denied.");
      }

      return {
        id,
      };
    }

    throw new ForbiddenException("Unknown role.");
  }
}
