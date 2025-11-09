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
import { CampaignFlowStepsService } from "./campaign-flow-steps.service";
import { CreateCampaignFlowStepDto } from "./dto/create-campaign-flow-step.dto";
import { QueryCampaignFlowStepDto } from "./dto/query-campaign-flow-step.dto";
import { UpdateCampaignFlowStepDto } from "./dto/update-campaign-flow-step.dto";

@Controller("campaign-flow-steps")
export class CampaignFlowStepsController {
  constructor(private readonly service: CampaignFlowStepsService) {}

  @Post()
  async create(@Body() dto: CreateCampaignFlowStepDto) {
    return this.service.create(dto);
  }

  @Get()
  @PaginationHeaders()
  findAll(@Query() query: QueryCampaignFlowStepDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCampaignFlowStepDto,
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
