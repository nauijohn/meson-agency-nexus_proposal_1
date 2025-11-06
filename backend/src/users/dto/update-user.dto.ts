import { IsArray, IsOptional, IsString } from "class-validator";

import { PartialType } from "@nestjs/mapped-types";

import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // @AutoMap()
  // email?: string;

  // @AutoMap()
  // password?: string;

  // @AutoMap()
  // firstName?: string;

  // @AutoMap()
  // lastName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  clientIds?: string[];
}
