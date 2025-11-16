import { AutoMap } from "automapper-classes";
import { Column, Entity } from "typeorm";

import { UserRelationsEntity } from "./user-relations.entity";

@Entity({ name: "users" })
export class User extends UserRelationsEntity {
  @Column()
  @AutoMap()
  firstName: string;

  @Column()
  @AutoMap()
  lastName: string;

  @Column({ unique: true })
  @AutoMap()
  email: string;

  @Column()
  @AutoMap()
  password: string;
}
