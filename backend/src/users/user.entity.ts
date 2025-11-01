import {
  AfterLoad,
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Client } from "../clients";
import { RefreshToken } from "../refresh-tokens";
import { Role } from "../roles";
import { UserClient } from "../user-clients/user-client.entity";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserClient, (uc) => uc.user)
  userClients: UserClient[];

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
    eager: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
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

  clients: Client[] = [];

  @AfterLoad()
  private populateClients() {
    this.clients = this.userClients?.map((uc) => uc.client) || [];
  }
}

// @ManyToMany(() => Client, (client) => client.users, {
//   eager: false,
//   cascade: false,
// })
// @JoinTable({
//   name: "user_clients", // custom join table name
//   joinColumn: { name: "user_id", referencedColumnName: "id" },
//   inverseJoinColumn: { name: "client_id", referencedColumnName: "id" },
// })
// clients: Client[];
