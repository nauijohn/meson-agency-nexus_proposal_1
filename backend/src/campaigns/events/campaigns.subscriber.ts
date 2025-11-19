import { ClsService } from "nestjs-cls";
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";

import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CLS_USER_ID } from "../../common/constants";
import {
  CampaignEvents,
  CampaignFlowAssignedEvent,
} from "../../common/events/campaign.events";
import { LoggerService } from "../../common/global/logger/logger.service";
import { UpdateCampaignDto } from "../dto/update-campaign.dto";
import { Campaign } from "../entities/campaign.entity";

@EventSubscriber()
@Injectable()
export class CampaignSubscriber implements EntitySubscriberInterface<Campaign> {
  constructor(
    datasource: DataSource,
    private readonly eventEmitter: EventEmitter2,
    private readonly cls: ClsService,
    private readonly logger: LoggerService,
  ) {
    datasource.subscribers.push(this);
  }

  listenTo() {
    return Campaign;
  }

  beforeInsert(event: InsertEvent<Campaign>): Promise<any> | void {
    event.entity.createdBy = this.cls.get(CLS_USER_ID);
  }

  beforeUpdate(event: UpdateEvent<Campaign>): Promise<any> | void {
    if (event.entity?.updatedBy)
      event.entity.updatedBy = this.cls.get<string>(CLS_USER_ID);
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
      this.logger.verbose("Flow assigned event detected");
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
      this.logger.verbose("Flow unassigned event detected");
      eventType = CampaignEvents.FlowUnassigned;
    }

    if (originalFlowId && updatedFlowId && originalFlowId !== updatedFlowId) {
      this.logger.verbose("Flow reassigned event detected");
      eventType = CampaignEvents.FlowReassigned;
    }

    if (eventType) {
      this.logger.verbose("Emitting event: " + eventType);
      this.eventEmitter.emit(eventType, eventPayload);
    }
  }
}
