import { JoinColumn, ManyToOne } from "typeorm";

import { CampaignFlowStep } from "../../campaign-flow-steps";
import { ClientContact } from "../../client-contacts/entities/client-contact.entity";
import { BaseIdEntity } from "../../common/bases";

export abstract class CampaignContactFlowStepRelations extends BaseIdEntity {
  @ManyToOne(() => CampaignFlowStep, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({
    name: "campaign_flow_step_id",
  })
  campaignFlowStep: CampaignFlowStep | null;

  @ManyToOne(() => ClientContact, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({
    name: "client_contact_id",
  })
  clientContact: ClientContact;
}
