import { AutoMap } from "automapper-classes";
import {
  AfterLoad,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from "typeorm";

import { Client } from "../../clients";
import { BaseEntity } from "../../common/bases";
import { RefreshToken } from "../../refresh-tokens";
import { Role } from "../../roles";
import { UserClient } from "../../user-clients/entities/user-client.entity";

@Entity({ name: "users" })
export class User extends BaseEntity {
  @Column({ name: "first_name" })
  @AutoMap()
  firstName: string;

  @Column({ name: "last_name" })
  @AutoMap()
  lastName: string;

  @Column({ unique: true })
  @AutoMap()
  email: string;

  @Column()
  @AutoMap()
  password: string;

  @OneToMany(() => UserClient, (uc) => uc.user)
  userClients: UserClient[];

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

  clients: Client[] = [];

  @AfterLoad()
  private populateClients() {
    this.clients = this.userClients?.map((uc) => uc.client) || [];
  }
}
