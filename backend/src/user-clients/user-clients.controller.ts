import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from "@nestjs/common";

import { PaginationHeaders } from "../common";
import { Serialize } from "../common/interceptors/serialize.interceptor";
import { CreateUserClientDto } from "./dto/create-user-client.dto";
import { QueryUserClientDto } from "./dto/query-user-client.dto";
import { UserClientDto } from "./dto/user-client.dto";
import { UserClientsService } from "./user-clients.service";

@Serialize(UserClientDto)
@Controller("user-clients")
export class UserClientsController {
  constructor(private readonly service: UserClientsService) {}

  @Post()
  create(@Body() dto: CreateUserClientDto) {
    return this.service.create(dto);
  }

  @Get()
  @PaginationHeaders()
  async findAll(@Query() query: QueryUserClientDto) {
    return await this.service.findAll(query);
  }

  @Get(":userId/:clientId")
  async findOne(
    @Param("userId") userId: string,
    @Param("clientId") clientId: string,
  ) {
    const entity = await this.service.findOne(userId, clientId);
    if (!entity) throw new NotFoundException();
    return entity;
  }
}
