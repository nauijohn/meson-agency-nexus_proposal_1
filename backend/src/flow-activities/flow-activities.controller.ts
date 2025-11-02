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
} from "@nestjs/common";

import { Serialize } from "../common/interceptors/serialize.interceptor";
import { CreateFlowActivityDto } from "./dto/create-flow-activity.dto";
import { FlowActivityDto } from "./dto/flow-activity.dto";
import { UpdateFlowActivityDto } from "./dto/update-flow-activity.dto";
import { FlowActivitiesService } from "./flow-activities.service";

@Serialize(FlowActivityDto)
@Controller("flow-activities")
export class FlowActivitiesController {
  constructor(private readonly service: FlowActivitiesService) {}

  @Post()
  create(@Body() dto: CreateFlowActivityDto) {
    console.log("DTO", dto);
    return this.service.create(dto);
  }

  @Get()
  async findAll() {
    return await this.service.findAll();
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
    const updated = Object.assign(entity, dto);
    return this.service.update(updated);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string) {
    await this.findOne(id);
    this.service.delete(id);
  }
}
