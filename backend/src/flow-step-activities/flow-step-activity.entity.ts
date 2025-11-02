import { Column, Entity, ManyToOne } from "typeorm";

import { BaseEntity } from "../common/bases";
import { FlowActivity } from "../flow-activities/flow-activity.entity";
import { FlowStep } from "../flow_steps/flow-step.entity";

@Entity({ name: "flow_step_activities" })
export class FlowStepActivity extends BaseEntity {
  @ManyToOne(() => FlowStep, (step) => step.stepActivities)
  flowStep: FlowStep;

  @ManyToOne(() => FlowActivity, { eager: true })
  activity: FlowActivity;

  @Column({ type: "timestamp", nullable: true })
  completedAt: Date | null;
}
