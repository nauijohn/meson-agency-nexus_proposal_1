import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { ClsService } from "nestjs-cls";
import { FindOptionsWhere, Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { TOTAL_KEY } from "../common/bases";
import { applyPaginationAndSorting } from "../common/utils/repository.pagination";
import { CreateEmployeeClientDto } from "./dto/create-employee-client.dto";
import { QueryEmployeeClientDto } from "./dto/query-employee-client.dto";
import { EmployeeClient } from "./entities/employee-client.entity";

@Injectable()
export class EmployeeClientsService {
  constructor(
    @InjectRepository(EmployeeClient)
    private readonly repository: Repository<EmployeeClient>,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly cls: ClsService,
  ) {}

  create(dto: CreateEmployeeClientDto): Promise<EmployeeClient> {
    const entity = this.mapper.map(
      dto,
      CreateEmployeeClientDto,
      EmployeeClient,
    );
    return this.repository.save(entity);
  }

  async findAll(query: QueryEmployeeClientDto): Promise<EmployeeClient[]> {
    const where:
      | FindOptionsWhere<EmployeeClient>
      | FindOptionsWhere<EmployeeClient>[]
      | undefined = {};

    if (query.employeeId) {
      // where.userId = query.userId;
      where.employee = {
        id: query.employeeId,
      };
    }

    const [entities, total] = await this.repository.findAndCount({
      where,
      ...applyPaginationAndSorting(query, "assignedDate"),
    });

    this.cls.set(TOTAL_KEY, total);

    return entities;
  }

  findOne(
    employeeId: string,
    clientId: string,
  ): Promise<EmployeeClient | null> {
    return this.repository.findOne({ where: { clientId, employeeId } });
  }
}
