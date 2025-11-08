import { Column, Entity } from "typeorm";

import { CampaignFlowStepRelationsEntity } from "./campaign-flow-step-relations.entity";

@Entity({ name: "campaign_flow_steps" })
export class CampaignFlowStep extends CampaignFlowStepRelationsEntity {
  @Column({ type: "timestamp", nullable: true })
  completedAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  scheduledAt?: Date;

  @Column({ type: "timestamp", nullable: true })
  dueAt?: Date;
}
