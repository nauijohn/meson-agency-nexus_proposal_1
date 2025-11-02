import { Column, Entity, ManyToOne } from "typeorm";

import { Campaign } from "../campaigns/campaign.entity";
import { Client } from "../clients/client.entity";
import { BaseEntity } from "../common/bases";
import { User } from "../users";

@Entity({ name: "rosters" })
export class Roster extends BaseEntity {
  @ManyToOne(() => Campaign)
  campaign: Campaign;

  @ManyToOne(() => Client)
  client: Client; // <-- add client reference

  @ManyToOne(() => User)
  agent: User; // agent assigned to this roster

  @Column({ type: "text", nullable: true })
  notes: string;
}
