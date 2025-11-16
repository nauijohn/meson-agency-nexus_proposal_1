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
import { LoggerService } from "../common/global/logger/logger.service";
import { CampaignContactFlowStepsService } from "./campaign-contact-flow-steps.service";
import { CreateCampaignContactFlowStepDto } from "./dto/create-campaign-contact-flow-step.dto";
import { QueryCampaignContactFlowStepDto } from "./dto/query-campaign-contact-flow-step.dto";
import { UpdateCampaignContactFlowStepDto } from "./dto/update-campaign-contact-flow-step.dto";

@Controller("campaign-contact-flow-steps")
export class CampaignContactFlowStepsController {
  constructor(
    private readonly service: CampaignContactFlowStepsService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async create(@Body() dto: CreateCampaignContactFlowStepDto) {
    return this.service.create(dto);
  }

  @Get()
  @PaginationHeaders()
  findAll(@Query() query: QueryCampaignContactFlowStepDto) {
    console.log("Query Params:", query);
    return this.service.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const campaign = await this.service.findOne(id);
    this.logger.debug("Fetched campaign:", campaign);
    return campaign;
  }

  @Patch(":id")
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCampaignContactFlowStepDto,
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
