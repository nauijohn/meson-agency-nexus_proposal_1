import { Column, Entity, ManyToOne } from "typeorm";

import { Client } from "../clients/client.entity";
import { BaseEntity } from "../common/bases";
import { Outcome } from "../outcomes/outcome.entity";

@Entity({ name: "client_outcome_settings" })
export class ClientOutcomeSetting extends BaseEntity {
  @ManyToOne(() => Outcome)
  outcome: Outcome;

  @ManyToOne(() => Client)
  client: Client;

  @Column({ type: "boolean", default: true })
  enabled: boolean; // true = active for this client

  @Column({ type: "boolean", default: false })
  isCustom: boolean; // true if client added this outcome themselves
}
