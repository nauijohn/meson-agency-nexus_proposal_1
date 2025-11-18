import { AutoMap } from "automapper-classes";
import { Column } from "typeorm";

import { BaseEntity } from "./base.entity";

export abstract class NamedEntity extends BaseEntity {
  @Column({ nullable: false })
  @AutoMap()
  name: string;
}
