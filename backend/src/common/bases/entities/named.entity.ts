import { AutoMap } from "automapper-classes";
import { Column } from "typeorm";

import { BaseAuditEntity } from "./base-audit.entity";

export abstract class NamedEntity extends BaseAuditEntity {
  @Column({ nullable: false })
  @AutoMap()
  name: string;
}
