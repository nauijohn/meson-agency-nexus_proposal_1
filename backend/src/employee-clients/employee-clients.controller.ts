import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from "@nestjs/common";

import { CheckAbilities } from "../auth/decorators/check-abilities.decorator";
import { Action } from "../auth/permissions/casl-ability.factory";
import { PaginationHeaders } from "../common";
import { Serialize } from "../common/interceptors/serialize.interceptor";
import { CreateEmployeeClientDto } from "./dto/create-employee-client.dto";
import { EmployeeClientDto } from "./dto/employee-client.dto";
import { QueryEmployeeClientDto } from "./dto/query-employee-client.dto";
import { EmployeeClientsService } from "./employee-clients.service";
import { EmployeeClient } from "./entities/employee-client.entity";

@Serialize(EmployeeClientDto)
@Controller("employee-clients")
export class EmployeeClientsController {
  constructor(private readonly service: EmployeeClientsService) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: EmployeeClient })
  create(@Body() dto: CreateEmployeeClientDto) {
    return this.service.create(dto);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: EmployeeClient })
  @PaginationHeaders()
  async findAll(@Query() query: QueryEmployeeClientDto) {
    return await this.service.findAll(query);
  }

  @Get(":employeeId/:clientId")
  @CheckAbilities({ action: Action.Read, subject: EmployeeClient })
  async findOne(
    @Param("employeeId") employeeId: string,
    @Param("clientId") clientId: string,
  ) {
    const entity = await this.service.findOne(employeeId, clientId);
    if (!entity) throw new NotFoundException();
    return entity;
  }
}
