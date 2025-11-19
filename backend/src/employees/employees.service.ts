import { type Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { ClsService } from "nestjs-cls";
import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TOTAL_KEY } from "../common/bases";
import { applyPaginationAndSorting } from "../common/utils/repository.pagination";
import { EmployeeRolesService } from "../employee-roles/employee-roles.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { QueryEmployeeDto } from "./dto/query-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { Employee } from "./entities/employee.entity";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly repository: Repository<Employee>,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly cls: ClsService,
    private readonly employeeRolesService: EmployeeRolesService,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const entity = this.mapper.map(dto, CreateEmployeeDto, Employee);

    if (dto.employeeRoles && dto.employeeRoles.length > 0) {
      const roles = await this.employeeRolesService.findAll();
      const filteredRoles = roles.filter((role) =>
        dto.employeeRoles.includes(role.type),
      );
      entity.roles = filteredRoles;
    }

    return this.repository.save(entity, { data: dto });
  }

  async findAll(query: QueryEmployeeDto): Promise<Employee[]> {
    const [entities, total] = await this.repository.findAndCount({
      relations: {
        user: true,
      },
      select: {},
      ...applyPaginationAndSorting(query),
    });

    this.cls.set(TOTAL_KEY, total);

    return entities;
  }

  findOne(id: string): Promise<Employee> {
    return this.repository.findOneOrFail({
      where: { id },
      relations: {},
    });
  }

  async update(entity: Employee, dto: UpdateEmployeeDto): Promise<Employee> {
    this.mapper.mutate(dto, entity, UpdateEmployeeDto, Employee);

    return this.repository.save(entity);
  }

  delete(id: string) {
    void this.repository.delete(id);
  }
}
