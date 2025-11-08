import { Column, Entity } from "typeorm";

import { CampaignContactFlowStepRelations } from "./campaign-contact-flow-step-relations.entity";

export enum CampaignContactFlowStepStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  STOPPED = "stopped",
}

@Entity({ name: "campaign_contact_flow_steps" })
export class CampaignContactFlowStep extends CampaignContactFlowStepRelations {
  @Column({
    type: "enum",
    enum: CampaignContactFlowStepStatus,
    default: CampaignContactFlowStepStatus.NOT_STARTED,
  })
  status: CampaignContactFlowStepStatus;

  @Column({ type: "timestamp", nullable: true, default: null })
  startedAt?: Date | null;

  @Column({ type: "timestamp", nullable: true, default: null })
  completedAt?: Date | null;

  @Column({ type: "boolean", default: false })
  isConnected: boolean;
}
