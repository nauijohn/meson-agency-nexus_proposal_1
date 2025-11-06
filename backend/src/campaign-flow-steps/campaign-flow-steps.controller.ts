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
} from "@nestjs/common";

import { CampaignFlowStepsService } from "./campaign-flow-steps.service";
import { CreateCampaignFlowStepDto } from "./dto/create-campaign-flow-step.dto";
import { UpdateCampaignFlowStepDto } from "./dto/update-campaign-flow-step.dto";

@Controller("campaign-flow-steps")
export class CampaignFlowStepsController {
  constructor(private readonly service: CampaignFlowStepsService) {}

  @Post()
  async create(@Body() dto: CreateCampaignFlowStepDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
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
