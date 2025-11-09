import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { PaginationHeaders } from "../common";
import { Serialize } from "../common/interceptors/serialize.interceptor";
import { CreateFlowActivityDto } from "./dto/create-flow-activity.dto";
import { FlowActivityDto } from "./dto/flow-activity.dto";
import { QueryFlowActivityDto } from "./dto/query-flow-activities.dto";
import { UpdateFlowActivityDto } from "./dto/update-flow-activity.dto";
import { FlowActivitiesService } from "./flow-activities.service";

@Serialize(FlowActivityDto)
@Controller("flow-activities")
export class FlowActivitiesController {
  constructor(private readonly service: FlowActivitiesService) {}

  @Post()
  create(@Body() dto: CreateFlowActivityDto) {
    return this.service.create(dto);
  }

  @Get()
  @PaginationHeaders()
  async findAll(@Query() query: QueryFlowActivityDto) {
    return await this.service.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const entity = await this.service.findOne(id);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateFlowActivityDto) {
    const entity = await this.findOne(id);
    return this.service.update(entity, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string) {
    await this.findOne(id);
    this.service.delete(id);
  }
}
