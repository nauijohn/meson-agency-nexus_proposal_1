import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { CampaignAssignedAFlowEvent } from "../../common/events/campaign.events";
import { FlowsService } from "../../flows/flows.service";
import { CampaignFlowStepsService } from "../campaign-flow-steps.service";

@Injectable()
export class CampaignFlowStepListener {
  constructor(
    private readonly campaignFlowStepsService: CampaignFlowStepsService,
    private readonly flowsService: FlowsService,
  ) {}

  @OnEvent(CampaignAssignedAFlowEvent.eventName)
  async handle(event: CampaignAssignedAFlowEvent) {
    console.log(
      "Handling CampaignAssignedAFlowEvent:",
      JSON.stringify(event, null, 2),
    );
    const flow = await this.flowsService.findOne(event.flow.id);
    const flowStepIds = flow?.steps.map((step) => step.id) || [];

    Promise.all(
      flowStepIds.map((id) => {
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
      .then(() => {
        console.log("Campaign flow steps created successfully");
      })
      .catch((error) => {
        console.error("Error creating campaign flow steps:", error);
      });
  }
}
