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
import { CreateFlowStepActivityDto } from "./dto/create-flow-step-activity.dto";
import { QueryFlowStepActivityDto } from "./dto/query-flow-step-activity.dto";
import { UpdateFlowStepActivityDto } from "./dto/update-flow-step-activity.dto";
import { FlowStepActivitiesService } from "./flow-step-activities.service";

@Controller("flow-step-activities")
export class FlowStepActivitiesController {
  constructor(private readonly service: FlowStepActivitiesService) {}

  @Post()
  async create(@Body() dto: CreateFlowStepActivityDto) {
    return this.service.create(dto);
  }

  @Get()
  @PaginationHeaders()
  findAll(@Query() query: QueryFlowStepActivityDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.service.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateFlowStepActivityDto,
  ) {
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
