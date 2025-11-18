import type { Request } from "express";

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";

import { CheckAbilities } from "../auth/decorators/check-abilities.decorator";
import { Action } from "../auth/permissions/casl-ability.factory";
import { PaginationHeaders } from "../common";
import { ClientsService } from "./clients.service";
import { UpdateClientDto } from "./dto";
import { CreateClientDto } from "./dto/create-client.dto";
import { QueryClientDto } from "./dto/query-client.dto";
import { Client } from "./entities/client.entity";

@Controller("clients")
export class ClientsController {
  constructor(
    private readonly service: ClientsService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @Post()
  @CheckAbilities({ action: Action.Create, subject: Client })
  create(@Body() dto: CreateClientDto) {
    return this.service.create(dto);
  }

  @Get()
  @CheckAbilities({ action: Action.Read, subject: Client })
  @PaginationHeaders()
  findAll(@Query() query: QueryClientDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const entity = await this.service.findOne(id);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateClientDto) {
    const entity = await this.findOne(id);
    return this.service.update(entity, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string) {
    await this.findOne(id);
    this.service.delete(id);
  }
}
