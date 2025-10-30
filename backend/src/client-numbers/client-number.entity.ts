import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Client } from "../clients/client.entity";

@Entity({ name: "client_numbers" })
export class ClientNumber {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "number" })
  number: string;

  @Column({
    type: "enum",
    enum: ["mobile", "work", "fax", "other"],
    default: "work",
  })
  type: "mobile" | "work" | "fax" | "other";

  @Column({ type: "boolean", default: false })
  preferred: boolean;

  @Column({ type: "enum", enum: ["active", "inactive"], default: "active" })
  status: "active" | "inactive";

  @ManyToMany(() => Client, (client) => client.numbers)
  clients: Client[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
