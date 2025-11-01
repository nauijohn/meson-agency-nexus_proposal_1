import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Client } from "../clients/client.entity";

@Entity({ name: "campaigns" })
export class Campaign {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ name: "start_date", type: "date" })
  startDate: Date;

  @Column({ name: "end_date", type: "date", nullable: true })
  endDate: Date | null;

  @Column({ default: "active" })
  status: "active" | "paused" | "completed";

  @ManyToOne(() => Client, (client) => client.campaigns, {
    onDelete: "CASCADE", // optional: delete campaigns if client is deleted
  })
  @JoinColumn({ name: "client_id" }) // links this column to the relation
  client: Client;

  // 👇 Hidden foreign key column (no direct relation exposure)
  @Column({ name: "client_id", select: false })
  clientId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

// | Column      | Type                                  | Notes                   |
// | ----------- | ------------------------------------- | ----------------------- |
// | id          | UUID (PK)                             |                         |
// | client_id   | FK → clients.id                       |                         |
// | name        | string                                | e.g. “Renewal Drive Q4” |
// | description | text                                  |                         |
// | start_date  | date                                  |                         |
// | end_date    | date                                  | nullable                |
// | status      | enum(‘active’, ‘paused’, ‘completed’) |                         |
// | created_at  | timestamp                             |                         |
// | updated_at  | timestamp                             |                         |
