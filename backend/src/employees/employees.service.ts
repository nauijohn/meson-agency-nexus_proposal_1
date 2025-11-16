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

    console.log("Created Employee Entity11:", entity);
    console.log("Created Employee dto11:", dto);

    if (dto.employeeRoles && dto.employeeRoles.length > 0) {
      const roles = await this.employeeRolesService.findAll();
      const filteredRoles = roles.filter((role) =>
        dto.employeeRoles.includes(role.type),
      );
      entity.roles = filteredRoles;
    }

    console.log("Created Employee Entity22:", entity);

    return this.repository.save(entity, { data: dto });
  }

  async findAll(query: QueryEmployeeDto): Promise<Employee[]> {
    const [entities, total] = await this.repository.findAndCount({
      relations: {},
      ...applyPaginationAndSorting(query),
    });

    this.cls.set(TOTAL_KEY, total);

    return entities;
  }

  findOne(id: string): Promise<Employee | null> {
    return this.repository.findOne({
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
