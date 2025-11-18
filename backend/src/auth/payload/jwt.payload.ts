import { AutoMap } from "automapper-classes";

import { EmployeeRoleType } from "../../employee-roles/entities/employee-role.entity";
import { RoleType } from "../../roles/entities";

export class JwtPayload {
  sub: string;

  @AutoMap()
  email: string;

  @AutoMap({ type: () => Array<RoleType> })
  roles: RoleType[];

  @AutoMap()
  employeeId?: string;

  @AutoMap({ type: () => Array<EmployeeRoleType> })
  employeeRoles?: EmployeeRoleType[];

  iat: number;

  exp: number;
}
