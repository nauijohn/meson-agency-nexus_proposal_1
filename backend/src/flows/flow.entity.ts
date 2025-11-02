import { Entity, OneToMany } from "typeorm";

import { Campaign } from "../campaigns/campaign.entity";
import { NamedEntity } from "../common/bases";
import { FlowStep } from "../flow_steps/flow-step.entity";

@Entity({ name: "flows" })
export class Flow extends NamedEntity {
  @OneToMany(() => FlowStep, (step) => step.flow, { cascade: true })
  steps: FlowStep[];

  @OneToMany(() => Campaign, (campaign) => campaign.flow)
  campaigns: Campaign[];
}
