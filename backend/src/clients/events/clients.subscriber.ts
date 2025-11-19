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
import { Client } from "../entities/client.entity";

@EventSubscriber()
@Injectable()
export class ClientsSubscriber implements EntitySubscriberInterface<Client> {
  constructor(
    datasource: DataSource,
    private readonly eventEmitter: EventEmitter2,
    private readonly cls: ClsService,
  ) {
    datasource.subscribers.push(this);
  }

  listenTo() {
    return Client;
  }

  beforeInsert(event: InsertEvent<Client>): Promise<any> | void {
    event.entity.createdBy = this.cls.get(CLS_USER_ID);
  }

  beforeUpdate(event: UpdateEvent<Client>): Promise<any> | void {
    if (event.entity?.updatedBy)
      event.entity.updatedBy = this.cls.get<string>(CLS_USER_ID);
  }
}
