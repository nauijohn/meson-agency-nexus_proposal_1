import { Column, Entity, ManyToOne } from "typeorm";

import { BaseEntity } from "../../common/bases";
import { FlowActivity } from "../../flow-activities/entities/flow-activity.entity";
import { FlowStep } from "../../flow_steps/entities/flow-step.entity";

@Entity({ name: "flow_step_activities" })
export class FlowStepActivity extends BaseEntity {
  @ManyToOne(() => FlowStep, (step) => step.stepActivities)
  flowStep: FlowStep;

  @ManyToOne(() => FlowActivity, { eager: true })
  activity: FlowActivity;

  @Column({
    name: "completed_at",
    type: "timestamp",
    nullable: true,
    default: null,
  })
  completedAt: Date | null;
}
