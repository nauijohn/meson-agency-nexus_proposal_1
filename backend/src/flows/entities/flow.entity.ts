import { AutoMap } from "automapper-classes";
import { Entity, OneToMany } from "typeorm";

import { Campaign } from "../../campaigns/entities/campaign.entity";
import { NamedEntity } from "../../common/bases";
import { FlowStep } from "../../flow_steps/entities/flow-step.entity";

@Entity({ name: "flows" })
export class Flow extends NamedEntity {
  @OneToMany(() => FlowStep, (step) => step.flow, { cascade: true })
  @AutoMap(() => [FlowStep])
  steps: FlowStep[];

  @OneToMany(() => Campaign, (campaign) => campaign.flow)
  campaigns: Campaign[];
}
