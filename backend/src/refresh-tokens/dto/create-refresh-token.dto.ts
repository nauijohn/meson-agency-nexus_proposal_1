import { AutoMap } from "automapper-classes";
import { Type } from "class-transformer";
import { IsJWT, IsOptional, IsString } from "class-validator";

import { User } from "../../users";

export class CreateRefreshTokenDto {
  @IsString()
  @IsJWT()
  @AutoMap()
  token: string;

  @IsOptional()
  @Type(() => User)
  userId: string;
}
