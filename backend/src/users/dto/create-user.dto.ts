import { AutoMap } from "automapper-classes";
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

import { EmployeeRoleType } from "../../employee-roles/entities/employee-role.entity";
import { RoleType } from "../../roles/entities";

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

  @IsOptional()
  @IsEnum(RoleType, { each: true })
  @IsArray()
  roles?: RoleType[] = [RoleType.USER];

  @IsOptional()
  @IsEnum(EmployeeRoleType, { each: true })
  @IsArray()
  employeeRoles?: EmployeeRoleType[];
}
