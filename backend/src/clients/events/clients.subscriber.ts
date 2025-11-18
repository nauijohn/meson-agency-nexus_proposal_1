import { ClsService } from "nestjs-cls";
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";

import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";

import { CLS_USER_ID } from "../../common/constants";
import { Client } from "../entities/client.entity";

@EventSubscriber()
@Injectable()
export class ClientSubscriber implements EntitySubscriberInterface<Client> {
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
}
