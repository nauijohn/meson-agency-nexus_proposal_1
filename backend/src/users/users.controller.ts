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

import { Serialize } from "../common/interceptors/serialize.interceptor";
import { CreateUserDto } from "./dto/create-user.dto";
import { QueryUserDto } from "./dto/query-user.dto";
import { UpdateCreateDto } from "./dto/update-user.dto";
import { UserDto } from "./dto/user.dto";
import { UsersService } from "./users.service";

@Serialize(UserDto)
@Controller("users")
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    console.log("DTO", dto);
    return this.service.create(dto);
  }

  @Get()
  async findAll() {
    const x = await this.service.findAll();
    console.log("Users:", x[0]);
    return x;
  }

  @Get(":id")
  async findOne(@Param("id") id: string, @Query() query?: QueryUserDto) {
    const entity = await this.service.findOne(id, query);
    if (!entity) throw new NotFoundException();
    return entity;
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateCreateDto) {
    const entity = await this.findOne(id);
    const updated = Object.assign(entity, dto);
    return this.service.update(updated);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param("id") id: string) {
    await this.findOne(id);
    this.service.delete(id);
  }
}
