import { AutoMap } from "automapper-classes";
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from "typeorm";

import { Client } from "../../clients";
import { Employee } from "../../employees/entities/employee.entity";

@Entity({ name: "employee_clients" })
export class EmployeeClient {
  @PrimaryColumn("uuid", { name: "employee_id" })
  @RelationId((ec: EmployeeClient) => ec.employee)
  @AutoMap()
  employeeId: string;

  @PrimaryColumn("uuid", { name: "client_id" })
  @RelationId((ec: EmployeeClient) => ec.client)
  @AutoMap()
  clientId: string;

  @ManyToOne(() => Employee, (e) => e.employeeClients, {
    eager: true,
    onDelete: "NO ACTION",
  })
  @JoinColumn({ name: "employee_id" })
  employee: Employee;

  @ManyToOne(() => Client, (c) => c.employeeClients, {
    eager: true,
    onDelete: "NO ACTION",
  })
  @JoinColumn({ name: "client_id" })
  client: Client;

  @CreateDateColumn()
  assignedDate: Date;
}
