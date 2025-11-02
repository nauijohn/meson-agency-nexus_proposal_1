import { Column, Entity, ManyToMany } from "typeorm";

import { NamedEntity } from "../common/bases";
import { User } from "../users";

@Entity({ name: "roles" })
export class Role extends NamedEntity {
  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
