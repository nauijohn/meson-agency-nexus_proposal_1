import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from "typeorm";

import { hash } from "../../auth/utils/security";
import { User } from "../entities/user.entity";

@EventSubscriber()
export class UsersSubscriber implements EntitySubscriberInterface<User> {
  constructor() {}

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    console.log("Event log: beforeInsert User...");

    if (event.entity?.password) {
      event.entity.password = await hash(event.entity.password);
    }
  }

  async beforeUpdate(event: UpdateEvent<User>): Promise<void> {
    console.log("Event log: beforeUpdate User...");

    if (event.entity?.password) {
      event.entity.password = await hash(String(event.entity.password));
    }
  }
}
