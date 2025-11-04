import { Type } from "class-transformer";
import { IsJWT, IsOptional, IsString } from "class-validator";

import { User } from "../../users";

export class CreateRefreshTokenDto {
  @IsString()
  @IsJWT()
  token: string;

  @IsOptional()
  @Type(() => User)
  user?: User;
}
