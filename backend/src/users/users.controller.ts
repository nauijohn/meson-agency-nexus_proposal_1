import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { PaginationHeaders } from "../common/decorators";
import { Serialize } from "../common/interceptors/serialize.interceptor";
import { RoleType } from "../roles/entities";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryUserDto } from "./dto/query-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDto } from "./dto/user.dto";
import { UsersService } from "./users.service";

@Serialize(UserDto)
@Controller("users")
@Roles(RoleType.ADMIN, RoleType.SUPER_ADMIN)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Get()
  @PaginationHeaders()
  async findAll(@Query() query: QueryUserDto) {
    return await this.service.findAll(query);
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Query() query?: QueryUserDto) {
    const entity = await this.service.findOne(id, query);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
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
