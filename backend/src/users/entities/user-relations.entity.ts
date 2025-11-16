import { JoinColumn, JoinTable, ManyToMany, OneToOne } from "typeorm";

import { Client } from "../../clients";
import { BaseEntity } from "../../common/bases";
import { Employee } from "../../employees/entities/employee.entity";
import { RefreshToken } from "../../refresh-tokens";
import { Role } from "../../roles/entities";

export abstract class UserRelationsEntity extends BaseEntity {
  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
    eager: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({
    name: "refresh_token_id",
    foreignKeyConstraintName: "fk_user_refresh_token",
    referencedColumnName: "id",
  })
  refreshToken?: RefreshToken;

  // ✅ Many-to-many relationship between User and Role
  @ManyToMany(() => Role, (role) => role.users, {
    eager: true, // optional: automatically load roles
    cascade: false, // optional: allow new roles to be created when user is saved
  })
  @JoinTable({
    name: "user_roles", // join table name
    joinColumn: { name: "user_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "role_id", referencedColumnName: "id" },
  })
  roles: Role[];

  @OneToOne(() => Employee, (employee) => employee.user, { nullable: true })
  @JoinColumn({ name: "employee_id" }) // User owns the join
  employee?: Employee;

  @OneToOne(() => Client, (client) => client.user, { nullable: true })
  @JoinColumn({ name: "client_id" }) // User owns the join
  client?: Client;
}
