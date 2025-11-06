import { AutoMap } from "automapper-classes";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from "typeorm";

import { CampaignFlowStep } from "../../campaign-flow-steps/entities/campaign-flow-step.entity";
import { Client } from "../../clients/entities/client.entity";
import { NamedEntity } from "../../common/bases";
import { Flow } from "../../flows/entities/flow.entity";

@Entity({ name: "campaigns" })
export class Campaign extends NamedEntity {
  @Column({ type: "text", nullable: true })
  @AutoMap()
  description: string;

  @Column({ name: "start_date", type: "date" })
  @AutoMap()
  startDate: Date;

  @Column({ name: "end_date", type: "date", nullable: true })
  @AutoMap(() => Date)
  endDate: Date | null;

  @Column({ default: "active" })
  @AutoMap()
  status: "active" | "paused" | "completed";

  @ManyToOne(() => Client, (client) => client.campaigns, {
    nullable: false,
    onDelete: "NO ACTION", // optional: delete campaigns if client is deleted
  })
  @JoinColumn({ name: "client_id" }) // links this column to the relation
  client: Client;

  // 👇 Hidden foreign key column (no direct relation exposure)
  @RelationId((campaign: Campaign) => campaign.client)
  clientId: string;

  @ManyToOne(() => Flow, (flow) => flow.campaigns, { nullable: true })
  @JoinColumn({ name: "flow_id" })
  flow?: Flow;

  @OneToMany(() => CampaignFlowStep, (cfs) => cfs.campaign, { nullable: true })
  campaignFlowSteps?: CampaignFlowStep[];
}
