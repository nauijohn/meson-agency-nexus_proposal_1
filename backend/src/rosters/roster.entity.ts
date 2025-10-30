import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Campaign } from "../campaigns/campaign.entity";
import { Client } from "../clients/client.entity";
import { User } from "../users";

@Entity({ name: "rosters" })
export class Roster {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Campaign)
  campaign: Campaign;

  @ManyToOne(() => Client)
  client: Client; // <-- add client reference

  @ManyToOne(() => User)
  agent: User; // agent assigned to this roster

  @Column({ type: "text", nullable: true })
  notes: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
