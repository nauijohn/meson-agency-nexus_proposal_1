import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";

import { hash } from "../../auth/utils/security";
import { RefreshToken } from "../entities/refresh-token.entity";

@EventSubscriber()
export class RefreshTokensSubscriber
  implements EntitySubscriberInterface<RefreshToken>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return RefreshToken;
  }

  async beforeInsert(event: InsertEvent<RefreshToken>): Promise<void> {
    if (event.entity?.token) {
      event.entity.token = await hash(event.entity.token);
    }
  }

  async beforeUpdate(event: UpdateEvent<RefreshToken>): Promise<void> {
    if (event.entity?.token) {
      event.entity.token = await hash(String(event.entity.token));
    }
  }
}
