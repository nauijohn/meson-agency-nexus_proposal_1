import { EmployeeRoleType } from "../../employee-roles/entities/employee-role.entity";

export class CreateEmployeeDto {
  userId: string;

  employeeRoles: EmployeeRoleType[];
}
