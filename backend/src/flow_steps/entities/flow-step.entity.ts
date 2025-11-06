import { AutoMap } from "automapper-classes";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";

import { CampaignFlowStep } from "../../campaign-flow-steps/entities/campaign-flow-step.entity";
import { NamedEntity } from "../../common/bases";
import { FlowStepActivity } from "../../flow-step-activities/entities/flow-step-activity.entity";
import { Flow } from "../../flows/entities/flow.entity";

@Entity({ name: "flow_steps" })
export class FlowStep extends NamedEntity {
  @Column()
  @AutoMap()
  order: number; // sequence within the flow

  @ManyToOne(() => Flow, (flow) => flow.steps, { nullable: false })
  flow: Flow;

  @OneToMany(() => FlowStepActivity, (fsa) => fsa.flowStep, { cascade: true })
  stepActivities: FlowStepActivity[];

  @OneToMany(() => CampaignFlowStep, (cfs) => cfs.flowStep)
  campaignFlowSteps: CampaignFlowStep[];
}
