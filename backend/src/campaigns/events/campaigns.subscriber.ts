import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from "typeorm";

import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import {
  CampaignEvents,
  CampaignFlowAssignedEvent,
} from "../../common/events/campaign.events";
import { UpdateCampaignDto } from "../dto/update-campaign.dto";
import { Campaign } from "../entities/campaign.entity";

@EventSubscriber()
@Injectable()
export class CampaignSubscriber implements EntitySubscriberInterface<Campaign> {
  constructor(
    datasource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {
    datasource.subscribers.push(this);
  }

  listenTo() {
    return Campaign;
  }

  afterUpdate(event: UpdateEvent<Campaign>): Promise<any> | void {
    this.detectFlowChangeEvents(event);
  }

  private detectFlowChangeEvents(event: UpdateEvent<Campaign>): void {
    let eventType: CampaignEvents | null = null;
    let eventPayload: unknown = null;

    const originalEntity = event.databaseEntity;
    const updatedEntity = event.entity as Campaign;

    const originalFlowId = originalEntity.flow?.id;
    const updatedFlowId = updatedEntity.flow?.id;

    if (!originalFlowId && updatedFlowId) {
      console.log("Flow assigned event detected");
      eventType = CampaignEvents.FlowAssigned;
      const dto = event.queryRunner.data as UpdateCampaignDto;
      eventPayload = new CampaignFlowAssignedEvent({
        campaignId: updatedEntity.id,
        flow: {
          id: updatedFlowId,
          flowSteps: dto.campaignFlowSteps,
        },
      });
    }

    if (originalFlowId && !updatedFlowId) {
      console.log("Flow unassigned event detected");
      eventType = CampaignEvents.FlowUnassigned;
    }

    if (originalFlowId && updatedFlowId && originalFlowId !== updatedFlowId) {
      console.log("Flow reassigned event detected");
      eventType = CampaignEvents.FlowReassigned;
    }

    if (eventType) {
      console.log("Emitting event:", eventType);
      this.eventEmitter.emit(eventType, eventPayload);
    }
  }
}
