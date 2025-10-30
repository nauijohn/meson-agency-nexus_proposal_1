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
} from "@nestjs/common";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateCreateDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const entity = await this.service.findOne(id);
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
