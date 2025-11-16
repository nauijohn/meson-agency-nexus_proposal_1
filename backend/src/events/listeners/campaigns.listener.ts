import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { CampaignContactFlowStepsService } from "../../campaign-contact-flow-steps/campaign-contact-flow-steps.service";
import { CampaignFlowStepsService } from "../../campaign-flow-steps/campaign-flow-steps.service";
import { CampaignsService } from "../../campaigns/campaigns.service";
import {
  CampaignEvents,
  CampaignFlowAssignedEvent,
} from "../../common/events/campaign.events";
import { FlowsService } from "../../flows/flows.service";

@Injectable()
export class CampaignsListener {
  constructor(
    private readonly flowsService: FlowsService,
    private readonly campaignsService: CampaignsService,
    private readonly campaignFlowStepsService: CampaignFlowStepsService,
    private readonly campaignContactFlowStepsService: CampaignContactFlowStepsService,
  ) {}

  @OnEvent(CampaignEvents.FlowAssigned)
  async handleFlowAssigned(event: CampaignFlowAssignedEvent) {
    const [campaign, flow] = await Promise.all([
      this.campaignsService.findOne(event.campaignId),
      this.flowsService.findOne(event.flow.id),
    ]);

    const clientContacts = campaign.client.contacts;

    Promise.all(
      clientContacts?.map((contact) => {
        return this.campaignContactFlowStepsService.create({
          clientContactId: contact.id,
          campaignId: campaign.id,
        });
      }),
    )
      .then(() => {
        console.log("Campaign contact flow steps created successfully");
      })
      .catch((error) => {
        console.error("Error creating campaign contact flow steps:", error);
      });

    const flowStepIds = flow?.steps.map((step) => step.id) || [];

    Promise.all(
      flowStepIds?.map((id) => {
        const flowStep = event.flow.flowSteps?.find(
          (fs) => fs.flowStepId === id,
        );
        return this.campaignFlowStepsService.create({
          campaign: { id: event.campaignId },
          flowStep: { id },
          scheduledAt: flowStep?.scheduledAt || undefined,
          dueAt: flowStep?.dueAt || undefined,
        });
      }),
    )
      .then((cfs) => {
        console.log("Campaign flow steps created successfully: ", cfs);
      })
      .catch((error) => {
        console.error("Error creating campaign flow steps:", error);
      });
  }
}
