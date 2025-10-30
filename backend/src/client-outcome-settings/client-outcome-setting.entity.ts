import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Client } from "../clients/client.entity";
import { Outcome } from "../outcomes/outcome.entity";

@Entity({ name: "client_outcome_settings" })
export class ClientOutcomeSetting {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Outcome)
  outcome: Outcome;

  @ManyToOne(() => Client)
  client: Client;

  @Column({ type: "boolean", default: true })
  enabled: boolean; // true = active for this client

  @Column({ type: "boolean", default: false })
  isCustom: boolean; // true if client added this outcome themselves

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
