import { CreateDateColumn, UpdateDateColumn } from "typeorm";

import { BaseIdEntity } from "./base-id.entity";

export abstract class BaseEntity extends BaseIdEntity {
  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;
}
