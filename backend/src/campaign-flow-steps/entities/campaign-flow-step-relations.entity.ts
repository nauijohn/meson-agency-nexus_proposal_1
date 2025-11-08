import { JoinColumn, ManyToOne } from "typeorm";

import { Campaign } from "../../campaigns/entities/campaign.entity";
import { BaseIdEntity } from "../../common/bases";
import { FlowStep } from "../../flow_steps/entities/flow-step.entity";

export abstract class CampaignFlowStepRelationsEntity extends BaseIdEntity {
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
}
