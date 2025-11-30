import { Entity } from "typeorm";

import {
  FlowStepActivityRelationsEntity,
} from "./flow-step-activity-relations.entity";

@Entity({ name: "flow_step_activities" })
export class FlowStepActivity extends FlowStepActivityRelationsEntity {
  // @Column({
  //   type: "timestamp",
  //   nullable: true,
  //   default: null,
  // })
  // completedAt: Date | null;
}
