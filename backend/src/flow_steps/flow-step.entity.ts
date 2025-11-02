import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { CampaignFlowStep } from "../campaign-flow-steps/campaign-flow-step.entity";
import { NamedEntity } from "../common/bases";
import { FlowStepActivity } from "../flow-step-activities/flow-step-activity.entity";
import { Flow } from "../flows/flow.entity";

@Entity({ name: "flow_steps" })
export class FlowStep extends NamedEntity {
  @Column()
  order: number; // sequence within the flow

  @ManyToOne(() => Flow, (flow) => flow.steps, { nullable: false })
  flow: Flow;

  @OneToMany(() => FlowStepActivity, (fsa) => fsa.flowStep, { cascade: true })
  stepActivities: FlowStepActivity[];

  @OneToMany(() => CampaignFlowStep, (cfs) => cfs.flowStep)
  campaignFlowSteps: CampaignFlowStep[];
}
