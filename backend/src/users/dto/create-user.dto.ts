import { AutoMap } from "automapper-classes";
import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @AutoMap()
  email: string;

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  password: string;

  @IsString()
  @IsNotEmpty()
  @AutoMap()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @AutoMap()
  lastName: string;

  @IsOptional()
  @IsJWT()
  refreshToken?: string;
}
