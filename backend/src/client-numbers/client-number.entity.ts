import { Column, Entity, ManyToMany } from "typeorm";

import { Client } from "../clients/entities/client.entity";
import { BaseEntity } from "../common/bases";

@Entity({ name: "client_numbers" })
export class ClientNumber extends BaseEntity {
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
}
