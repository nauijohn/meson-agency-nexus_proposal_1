import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  RelationId,
} from "typeorm";

import { CampaignFlowStep } from "../campaign-flow-steps/campaign-flow-step.entity";
import { Client } from "../clients/client.entity";
import { NamedEntity } from "../common/bases";
import { Flow } from "../flows/flow.entity";

@Entity({ name: "campaigns" })
export class Campaign extends NamedEntity {
  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ name: "start_date", type: "date" })
  startDate: Date;

  @Column({ name: "end_date", type: "date", nullable: true })
  endDate: Date | null;

  @Column({ default: "active" })
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
