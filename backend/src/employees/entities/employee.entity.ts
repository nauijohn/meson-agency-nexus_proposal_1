import { Entity, JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm";

import { BaseEntity } from "../../common/bases";
import { EmployeeClient } from "../../employee-clients/entities/employee-client.entity";
import { EmployeeRole } from "../../employee-roles/entities/employee-role.entity";
import { User } from "../../users";

@Entity({ name: "employees" })
export class Employee extends BaseEntity {
  @OneToOne(() => User, (user) => user.employee)
  user: User;

  @OneToMany(() => EmployeeClient, (employeeClient) => employeeClient.employee)
  employeeClients: EmployeeClient[];

  @ManyToMany(() => EmployeeRole)
  @JoinTable({
    name: "employee_employee_roles",
    joinColumn: { name: "employee_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
  })
  roles: EmployeeRole[];
}
