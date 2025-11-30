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
import { ClientContactsService } from "./client-contacts.service";
import { CreateClientContactDto } from "./dto/create-client-contact.dto";
import { QueryClientContactDto } from "./dto/query-client-contact.dto";
import { UpdateClientContactDto } from "./dto/update-client-contact.dto";

@Controller("client-contacts")
export class ClientContactsController {
  constructor(private readonly service: ClientContactsService) {}

  @Post()
  create(@Body() dto: CreateClientContactDto) {
    return this.service.create(dto);
  }

  @Get()
  @PaginationHeaders()
  findAll(@Query() query: QueryClientContactDto) {
    return this.service.findAll(query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateClientContactDto) {
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
