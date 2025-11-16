import { JoinColumn, ManyToOne, OneToMany, RelationId } from "typeorm";

import { CampaignContactFlowStep } from "../../campaign-contact-flow-steps/entities/campaign-contact-flow-step.entity";
import { CampaignFlowStep } from "../../campaign-flow-steps/entities/campaign-flow-step.entity";
import { Client } from "../../clients/entities/client.entity";
import { NamedEntity } from "../../common/bases";
import { Flow } from "../../flows/entities/flow.entity";

export abstract class CampaignRelationsEntity extends NamedEntity {
  // 👇 Hidden foreign key column (no direct relation exposure)
  @RelationId((campaign: CampaignRelationsEntity) => campaign.client)
  clientId: string;

  @ManyToOne(() => Client, (client) => client.campaigns, {
    nullable: false,
    onDelete: "NO ACTION", // optional: delete campaigns if client is deleted
  })
  @JoinColumn({ name: "client_id" }) // links this column to the relation
  client: Client;

  @ManyToOne(() => Flow, (flow) => flow.campaigns, { nullable: true })
  @JoinColumn({ name: "flow_id" })
  flow?: Flow;

  @OneToMany(() => CampaignFlowStep, (cfs) => cfs.campaign, { nullable: true })
  campaignFlowSteps?: CampaignFlowStep[];

  @OneToMany(() => CampaignContactFlowStep, (ccfs) => ccfs.campaign, {
    onDelete: "CASCADE",
  })
  contactFlowSteps?: CampaignContactFlowStep[];
}
