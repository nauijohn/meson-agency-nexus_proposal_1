import { ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/bases";
import { FlowActivity } from "../../flow-activities/entities/flow-activity.entity";
import { FlowStep } from "../../flow_steps/entities/flow-step.entity";

export abstract class FlowStepActivityRelationsEntity extends BaseEntity {
  @ManyToOne(() => FlowStep, (step) => step.stepActivities)
  flowStep: FlowStep;

  @ManyToOne(() => FlowActivity, { eager: true })
  activity: FlowActivity;
}
