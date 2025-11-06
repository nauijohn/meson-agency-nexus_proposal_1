import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";

import { CallProvider } from "../call-providers/call-provider.entity";
import { Campaign } from "../campaigns/entities/campaign.entity";
import { ClientContact } from "../client-contacts/client-contact.entity";
import { Client } from "../clients/entities/client.entity";
import { BaseEntity } from "../common/bases";
import { Outcome } from "../outcomes/outcome.entity";
import { User } from "../users/";

@Entity({ name: "calls" })
export class Call extends BaseEntity {
  @ManyToOne(() => User)
  agent: User;

  @ManyToOne(() => Client)
  client: Client;

  @ManyToOne(() => Campaign)
  campaign: Campaign;

  @ManyToOne(() => ClientContact)
  contact: ClientContact;

  @Column({ type: "enum", enum: ["inbound", "outbound"] })
  direction: "inbound" | "outbound";

  @Column({
    type: "enum",
    enum: ["pending", "missed", "accepted", "completed", "failed"],
  })
  status: "pending" | "missed" | "accepted" | "completed" | "failed";

  @ManyToMany(() => Outcome)
  @JoinTable({
    name: "call_outcomes",
    joinColumn: { name: "call_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "outcome_id", referencedColumnName: "id" },
  })
  outcomes: Outcome[];

  // provider reference
  @ManyToOne(() => CallProvider)
  provider: CallProvider;

  @Column({ type: "timestamp", nullable: true })
  callStart: Date;

  @Column({ type: "timestamp", nullable: true })
  callEnd: Date;

  @Column({ type: "int", nullable: true })
  duration: number;

  @Column({ type: "text", nullable: true })
  notes: string;
}
