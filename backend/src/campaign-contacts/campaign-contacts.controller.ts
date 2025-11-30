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
import { CampaignContactsService } from "./campaign-contacts.service";
import { CreateCampaignContactDto } from "./dto/create-campaign-contact.dto";
import { QueryCampaignContactDto } from "./dto/query-campaign-contact.dto";
import { UpdateCampaignContactDto } from "./dto/update-campaign-contact.dto";

@Controller("campaign-contacts")
export class CampaignContactsController {
  constructor(
    private readonly service: CampaignContactsService,
    private readonly logger: LoggerService,
  ) {}

  @Post()
  async create(@Body() dto: CreateCampaignContactDto) {
    return this.service.create(dto);
  }

  @Get()
  @PaginationHeaders()
  findAll(@Query() query: QueryCampaignContactDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const campaign = await this.service.findOne(id);
    this.logger.debug("Fetched campaign:", campaign);
    return campaign;
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateCampaignContactDto) {
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
