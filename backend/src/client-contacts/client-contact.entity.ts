import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Client } from "../clients/client.entity";

@Entity({ name: "client_contacts" })
export class ClientContact {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "contact_name" })
  contactName: string;

  @Column({ name: "contact_number" })
  contactNumber: string;

  @Column({
    type: "enum",
    enum: ["mobile", "home", "work", "other"],
    default: "mobile",
  })
  type: "mobile" | "home" | "work" | "other";

  @Column({
    type: "enum",
    enum: ["active", "inactive", "do_not_call"],
    default: "active",
  })
  status: "active" | "inactive" | "do_not_call";

  @Column({ type: "boolean", default: false })
  preferred: boolean;

  // Many-to-many: contact ↔ clients
  @ManyToMany(() => Client, (client) => client.contacts)
  clients: Client[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

// | Column         | Type                                      | Notes                                                        |
// | -------------- | ----------------------------------------- | ------------------------------------------------------------ |
// | id             | UUID (PK)                                 |                                                              |
// | client_id      | FK → clients.id                           | The client who owns this contact                             |
// | lead_id        | FK → client_leads.id                      | Optional — link to a lead if this contact has been qualified |
// | contact_number | string                                    | The phone number                                             |
// | type           | enum(‘mobile’, ‘home’, ‘work’, ‘other’)   | optional, useful for filtering                               |
// | status         | enum(‘active’, ‘inactive’, ‘do_not_call’) | optional                                                     |
// | preferred      | boolean                                   | Indicates the preferred number for contact                   |
// | created_at     | timestamp                                 |                                                              |
// | updated_at     | timestamp                                 |                                                              |
