import {
  JoinColumn,
  ManyToOne,
  RelationId,
} from "typeorm";

import { CampaignFlowStep } from "../../campaign-flow-steps";
import { Campaign } from "../../campaigns/entities/campaign.entity";
import {
  ClientContact,
} from "../../client-contacts/entities/client-contact.entity";
import { BaseIdEntity } from "../../common/bases";

export abstract class CampaignContactRelations extends BaseIdEntity {
  @RelationId((ccr: CampaignContactRelations) => ccr.campaignFlowStep)
  campaignFlowStepId: string | null;

  @ManyToOne(() => CampaignFlowStep, { onDelete: "CASCADE", nullable: true })
  @JoinColumn({
    name: "campaign_flow_step_id",
  })
  campaignFlowStep: CampaignFlowStep | null;

  @RelationId((ccr: CampaignContactRelations) => ccr.clientContact)
  clientContactId: string;

  @ManyToOne(() => ClientContact, { onDelete: "CASCADE", nullable: false })
  @JoinColumn({
    name: "client_contact_id",
  })
  clientContact: ClientContact;

  @RelationId((ccr: CampaignContactRelations) => ccr.campaign)
  campaignId: string;

  @ManyToOne(() => Campaign, (campaign) => campaign.campaignContacts, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "campaign_id" })
  campaign: Campaign;
}
