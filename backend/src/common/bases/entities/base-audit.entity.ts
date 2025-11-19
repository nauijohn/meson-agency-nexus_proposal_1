import { Column } from "typeorm";

import { BaseEntity } from "./base.entity";

export abstract class BaseAuditEntity extends BaseEntity {
  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;
}
