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

import { CheckAbilities } from "../auth/decorators/check-abilities.decorator";
import { Action } from "../auth/permissions/casl-ability.factory";
import { PaginationHeaders } from "../common/decorators/pagination-headers.decorator";
import { LoggerService } from "../common/global/logger/logger.service";
import { Serialize } from "../common/interceptors/serialize.interceptor";
import { CampaignsService } from "./campaigns.service";
import { CampaignDto } from "./dto/campaign.dto";
import { CreateCampaignDto } from "./dto/create-campaign.dto";
import { QueryCampaignDto } from "./dto/query-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";
import { Campaign } from "./entities/campaign.entity";

@Serialize(CampaignDto)
@Controller("campaigns")
export class CampaignsController {
  constructor(
    private readonly service: CampaignsService,
    private readonly logger: LoggerService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: Campaign })
  async create(@Body() dto: CreateCampaignDto) {
    return this.service.create(dto);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: Campaign })
  @PaginationHeaders()
  findAll(@Query() query: QueryCampaignDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  @CheckAbilities({ action: Action.Read, subject: Campaign })
  async findOne(@Param("id") id: string) {
    const campaign = await this.service.findOne(id);

    return campaign;
  }

  @Patch(":id")
  @CheckAbilities({ action: Action.Update, subject: Campaign })
  async update(@Param("id") id: string, @Body() dto: UpdateCampaignDto) {
    const entity = await this.service.findOne(id);
    return this.service.update(entity, dto);
  }

  @Delete(":id")
  @CheckAbilities({ action: Action.Delete, subject: Campaign })
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string) {
    await this.findOne(id);
    this.service.delete(id);
  }
}
