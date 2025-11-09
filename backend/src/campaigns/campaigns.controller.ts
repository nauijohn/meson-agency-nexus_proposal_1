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

import { Serialize } from "../common/interceptors/serialize.interceptor";
import { CampaignsService } from "./campaigns.service";
import { CampaignDto } from "./dto/campaign.dto";
import { CreateCampaignDto } from "./dto/create-campaign.dto";
import { QueryCampaignDto } from "./dto/query-campaign.dto";
import { UpdateCampaignDto } from "./dto/update-campaign.dto";

@Serialize(CampaignDto)
@Controller("campaigns")
export class CampaignsController {
  constructor(private readonly service: CampaignsService) {}

  @Post()
  async create(@Body() dto: CreateCampaignDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryCampaignDto) {
    console.log("QueryCampaignDto: ", query);
    return this.service.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.service.findOne(id);
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
