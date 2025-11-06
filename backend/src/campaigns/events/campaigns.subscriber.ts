import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";

import { Campaign } from "../entities/campaign.entity";

@EventSubscriber()
export class CampaignSubscriber implements EntitySubscriberInterface<Campaign> {
  listenTo() {
    return Campaign;
  }

  beforeInsert(event: InsertEvent<Campaign>): void {
    console.log("BEFORE CAMPAIGN INSERTED: ", event.entity);
  }
}
