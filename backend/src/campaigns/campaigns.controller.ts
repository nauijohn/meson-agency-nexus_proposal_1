import type { Request } from "express";

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

import { CaslAbilityFactory } from "../auth/permissions/casl-ability.factory";
import { PaginationHeaders } from "../common/decorators/pagination-headers.decorator";
import { LoggerService } from "../common/global/logger/logger.service";
import { Serialize } from "../common/interceptors/serialize.interceptor";
import { CampaignsService } from "./campaigns.service";
import { CampaignDto } from "./dto/campaign.dto";
import { CreateCampaignDto } from "./dto/create-campaign.dto";
import { QueryCampaignDto } from "./dto/query-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";

@Serialize(CampaignDto)
@Controller("campaigns")
export class CampaignsController {
  constructor(
    private readonly service: CampaignsService,
    private readonly logger: LoggerService,
    private readonly abilityFactory: CaslAbilityFactory,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @Post()
  async create(@Body() dto: CreateCampaignDto) {
    return this.service.create(dto);
  }

  @Get()
  @PaginationHeaders()
  findAll(@Query() query: QueryCampaignDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const campaign = await this.service.findOne(id);

    return campaign;
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateCampaignDto) {
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
