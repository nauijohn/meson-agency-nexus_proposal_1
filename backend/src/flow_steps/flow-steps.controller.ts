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
import { CreateFlowStepDto } from "./dto/create-flow-step.dto";
import { QueryFlowStepDto } from "./dto/query-flow-step.dto";
import { UpdateFlowStepDto } from "./dto/update-flow-step.dto";
import { FlowStepsService } from "./flow-steps.service";

@Controller("flow-steps")
export class FlowStepsController {
  constructor(private readonly service: FlowStepsService) {}

  @Post()
  async create(@Body() dto: CreateFlowStepDto) {
    return this.service.create(dto);
  }

  @Get()
  @PaginationHeaders()
  findAll(@Query() query: QueryFlowStepDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return await this.service.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateFlowStepDto) {
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
