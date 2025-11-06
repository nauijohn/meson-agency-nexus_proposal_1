import { Column, Entity, ManyToMany } from "typeorm";

import { Client } from "../clients/entities/client.entity";
import { NamedEntity } from "../common/bases";

@Entity({ name: "client_contacts" })
export class ClientContact extends NamedEntity {
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
}
