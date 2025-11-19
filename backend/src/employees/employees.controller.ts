import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { PaginationHeaders } from "../common";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { QueryEmployeeDto } from "./dto/query-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { EmployeesService } from "./employees.service";

@Controller("employees")
export class EmployeesController {
  constructor(private readonly service: EmployeesService) {}

  @Post()
  async create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }

  @Get()
  @PaginationHeaders()
  findAll(@Query() query: QueryEmployeeDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.service.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateEmployeeDto) {
    const entity = await this.service.findOne(id);
    return this.service.update(entity, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string) {
    await this.findOne(id);
    this.service.delete(id);
  }
}
