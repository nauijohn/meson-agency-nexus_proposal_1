import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { CampaignAssignedToFlowEvent } from "../../common/events/campaign.events";
import { FlowsService } from "../../flows/flows.service";
import { CampaignFlowStepsService } from "../campaign-flow-steps.service";

@Injectable()
export class CampaignFlowStepListener {
  constructor(
    private readonly campaignFlowStepsService: CampaignFlowStepsService,
    private readonly flowsService: FlowsService,
  ) {}

  @OnEvent(CampaignAssignedToFlowEvent.eventName)
  async handle(event: CampaignAssignedToFlowEvent) {
    console.log("Handling CampaignAssignedToFlowEvent:", event);
    const flow = await this.flowsService.findOne(event.flowId);
    const flowStepIds = flow?.steps.map((step) => step.id) || [];
    console.log("Found flowStepIds:", flowStepIds);

    Promise.all(
      flowStepIds.map((id) =>
        this.campaignFlowStepsService.create({
          campaign: { id: event.campaignId },
          flowStep: { id },
        }),
      ),
    )
      .then(() => {
        console.log("Campaign flow steps created successfully");
      })
      .catch((error) => {
        console.error("Error creating campaign flow steps:", error);
      });
  }
}
