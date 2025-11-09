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
import { CreateFlowDto } from "./dto/create-flow.dto";
import { QueryFlowDto } from "./dto/query-flow.dto";
import { UpdateFlowDto } from "./dto/update-flow.dto";
import { FlowsService } from "./flows.service";

@Controller("flows")
export class FlowsController {
  constructor(private readonly service: FlowsService) {}

  @Post()
  async create(@Body() dto: CreateFlowDto) {
    return this.service.create(dto);
  }

  @Get()
  @PaginationHeaders()
  findAll(@Query() query: QueryFlowDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.service.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateFlowDto) {
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
