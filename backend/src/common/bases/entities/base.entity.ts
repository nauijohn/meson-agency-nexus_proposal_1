import { Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

import { BaseIdEntity } from "./base-id.entity";

export abstract class BaseEntity extends BaseIdEntity {
  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;
}
