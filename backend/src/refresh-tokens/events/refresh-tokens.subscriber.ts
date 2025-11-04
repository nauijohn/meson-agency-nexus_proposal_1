import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";

import { hash } from "../../auth/utils/security";
import { RefreshToken } from "../refresh-token.entity";

@EventSubscriber()
export class RefreshTokensSubscriber
  implements EntitySubscriberInterface<RefreshToken>
{
  constructor() {}

  listenTo() {
    return RefreshToken;
  }

  async beforeInsert(event: InsertEvent<RefreshToken>): Promise<void> {
    console.log("Event log: beforeInsert RefreshToken...");

    if (event.entity?.token) {
      event.entity.token = await hash(event.entity.token);
    }
  }

  async beforeUpdate(event: UpdateEvent<RefreshToken>): Promise<void> {
    console.log("Event log: beforeUpdate RefreshToken...");

    if (event.entity?.token) {
      event.entity.token = await hash(String(event.entity.token));
    }
  }
}
