import { AutoMap } from "automapper-classes";
import { Column, Entity } from "typeorm";

import { FlowStepRelationsEntity } from "./flow-step-relations.entity";

@Entity({ name: "flow_steps" })
export class FlowStep extends FlowStepRelationsEntity {
  @Column()
  @AutoMap()
  order: number; // sequence within the flow
}
