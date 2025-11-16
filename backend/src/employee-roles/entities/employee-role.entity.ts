import { Column, Entity } from "typeorm";

import { NamedEntity } from "../../common/bases";

export enum EmployeeRoleType {
  MANAGER = "manager",
  DEVELOPER = "developer",
  AGENT = "agent",
  LEAD = "lead",
}

@Entity({ name: "employee_roles" })
export class EmployeeRole extends NamedEntity {
  @Column({ type: "enum", enum: EmployeeRoleType })
  type: EmployeeRoleType;
}
