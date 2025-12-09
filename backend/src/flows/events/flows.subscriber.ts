import { ClsService } from "nestjs-cls";
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
} from "typeorm";

import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CLS_USER_ID } from "../../common/constants";
import { Flow } from "../entities/flow.entity";

@EventSubscriber()
@Injectable()
export class FlowsSubscriber implements EntitySubscriberInterface<Flow> {
  constructor(
    dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
    private readonly cls: ClsService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return Flow;
  }

  beforeUpdate(event: UpdateEvent<Flow>): Promise<any> | void {
    if (event.entity?.updatedBy) {
      event.entity.updatedBy = this.cls.get<string>(CLS_USER_ID);
      event.entity.updatedAt = new Date();
    }
  }
}
