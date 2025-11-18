import { Expose, Transform, Type } from "class-transformer";

import { BaseDto } from "../../common/bases/base.dto";
import { EmployeeDto } from "../../employees/dto/employee.dto";
import { RoleDto } from "../../roles/dto/role.dto";

export class UserDto extends BaseDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => RoleDto)
  @Transform(({ value }: { value: RoleDto[] }) => {
    return value.map((role) => role.type) || [];
  })
  roles: string[];

  @Expose()
  @Type(() => EmployeeDto)
  employee: EmployeeDto;
}
