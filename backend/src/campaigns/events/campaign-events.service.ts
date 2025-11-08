import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import {
  CampaignEvents,
  CampaignFlowAssignedEvent,
} from "../../common/events/campaign.events";
import { DomainEventsService } from "../../common/events/domain-events.service";

@Injectable()
export class CampaignEventsService extends DomainEventsService<CampaignEvents> {
  constructor(eventEmitter: EventEmitter2) {
    super(eventEmitter);
  }

  /** Typed helper methods */
  created() {
    this.emit(CampaignEvents.Created);
  }

  // updated(campaign: any) {
  //   this.emit(CampaignEvents.Updated, { campaign });
  // }

  flowAssigned(payload: CampaignFlowAssignedEvent) {
    this.emit(CampaignEvents.FlowAssigned, payload);
  }

  /** Event handlers mapping */
  protected get eventHandlers(): Partial<
    Record<Partial<CampaignEvents>, (payload?: unknown) => void>
  > {
    return {
      // [CampaignEvents.Created]: (payload) => {
      //   this.logger.log("Handling campaign.created", payload);
      //   this.created();
      // },
      // [CampaignEvents.Updated]: (payload) => {
      //   this.logger.log("Handling campaign.updated", payload);
      //   this.updated(payload);
      // },
      // [CampaignEvents.FlowAssigned]: (payload: CampaignFlowAssignedEvent) => {
      //   this.logger.log("Handling campaign.flowAssigned", payload);
      //   this.flowAssigned(payload);
      // },
    };
  }
}
