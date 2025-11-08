import { AutoMap } from "automapper-classes";
import { OneToMany } from "typeorm";

import { Campaign } from "../../campaigns/entities/campaign.entity";
import { NamedEntity } from "../../common/bases";
import { FlowStep } from "../../flow_steps/entities/flow-step.entity";

export abstract class FlowRelationsEntity extends NamedEntity {
  @OneToMany(() => FlowStep, (step) => step.flow, { cascade: true })
  @AutoMap(() => [FlowStep])
  steps: FlowStep[];

  @OneToMany(() => Campaign, (campaign) => campaign.flow)
  campaigns: Campaign[];
}
