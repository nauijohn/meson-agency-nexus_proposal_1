import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from "@nestjs/common";

import { PaginationHeaders } from "../common";
import { Serialize } from "../common/interceptors/serialize.interceptor";
import { CreateEmployeeClientDto } from "./dto/create-employee-client.dto";
import { EmployeeClientDto } from "./dto/employee-client.dto";
import { QueryEmployeeClientDto } from "./dto/query-employee-client.dto";
import { EmployeeClientsService } from "./employee-clients.service";

@Serialize(EmployeeClientDto)
@Controller("employee-clients")
export class EmployeeClientsController {
  constructor(private readonly service: EmployeeClientsService) {}

  @Post()
  create(@Body() dto: CreateEmployeeClientDto) {
    return this.service.create(dto);
  }

  @Get()
  @PaginationHeaders()
  async findAll(@Query() query: QueryEmployeeClientDto) {
    return await this.service.findAll(query);
  }

  @Get(":employeeId/:clientId")
  async findOne(
    @Param("employeeId") employeeId: string,
    @Param("clientId") clientId: string,
  ) {
    const entity = await this.service.findOne(employeeId, clientId);
    if (!entity) throw new NotFoundException();
    return entity;
  }
}
