import { Column, Entity, ManyToMany } from "typeorm";

import { NamedEntity } from "../../common/bases";
import { User } from "../../users";

export enum RoleType {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  CLIENT = "client",
  EMPLOYEE = "employee",
  USER = "user",
}

@Entity({ name: "roles" })
export class Role extends NamedEntity {
  @Column({ nullable: true })
  description?: string;

  @Column({ unique: true, type: "enum", enum: RoleType, nullable: false })
  type: RoleType;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
