import { ManyToOne, OneToMany } from "typeorm";

import { CampaignFlowStep } from "../../campaign-flow-steps/entities/campaign-flow-step.entity";
import { NamedEntity } from "../../common/bases";
import { FlowStepActivity } from "../../flow-step-activities/entities/flow-step-activity.entity";
import { Flow } from "../../flows/entities/flow.entity";

export abstract class FlowStepRelationsEntity extends NamedEntity {
  @ManyToOne(() => Flow, (flow) => flow.steps, { nullable: false })
  flow: Flow;

  @OneToMany(() => FlowStepActivity, (fsa) => fsa.flowStep, {
    cascade: true,
    onDelete: "CASCADE",
  })
  activities: FlowStepActivity[];

  @OneToMany(() => CampaignFlowStep, (cfs) => cfs.flowStep)
  campaignFlowSteps: CampaignFlowStep[];
}
