import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../users";

@Entity({ name: "roles" })
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  name: string; // e.g. "admin", "manager", "agent"

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
