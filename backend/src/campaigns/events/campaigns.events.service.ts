import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { DomainEventsService } from "../../common/events/domain-events.service";

export enum CampaignEvents {
  // Created = "campaign.created",
  // Updated = "campaign.updated",
  AssignedFlow = "campaign.assignedFlow",
}

@Injectable()
export class CampaignsEventsService extends DomainEventsService<CampaignEvents> {
  constructor(eventEmitter: EventEmitter2) {
    super(eventEmitter);
  }

  /** Typed helper methods */
  // created(campaign: any) {
  //   this.emit(CampaignEvents.Created, { campaign });
  // }

  // updated(campaign: any) {
  //   this.emit(CampaignEvents.Updated, { campaign });
  // }

  assignedFlow(campaignId: string, flow: any) {
    this.emit(CampaignEvents.AssignedFlow, { campaignId, flow });
  }

  /** Event handlers mapping */
  protected get eventHandlers(): Record<
    CampaignEvents,
    (payload?: unknown) => void
  > {
    return {
      // [CampaignEvents.Created]: (payload) => {
      //   this.logger.log("Handling campaign.created", payload);
      //   this.created(payload);
      // },
      // [CampaignEvents.Updated]: (payload) => {
      //   this.logger.log("Handling campaign.updated", payload);
      //   this.updated(payload);
      // },
      [CampaignEvents.AssignedFlow]: (payload) => {
        this.logger.log("Handling campaign.assignedFlow", payload);
        this.assignedFlow(payload?.campaignId, payload?.flow);
      },
    };
  }
}
