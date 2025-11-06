import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

import { Campaign } from "../../campaigns/campaign.entity";
import { BaseIdEntity } from "../../common/bases";
import { FlowStep } from "../../flow_steps/flow-step.entity";

@Entity({ name: "campaign_flow_steps" })
export class CampaignFlowStep extends BaseIdEntity {
  @ManyToOne(() => Campaign, (campaign) => campaign.campaignFlowSteps, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "campaign_id" })
  campaign: Campaign;

  @ManyToOne(() => FlowStep, (step) => step.campaignFlowSteps, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "flow_step_id" })
  flowStep: FlowStep;

  @Column({ name: "completed_at", type: "timestamp", nullable: true })
  completedAt?: Date;

  @Column({ name: "scheduled_at", type: "timestamp", nullable: true })
  scheduledAt?: Date;

  @Column({ name: "due_at", type: "timestamp", nullable: true })
  dueAt?: Date;
}
