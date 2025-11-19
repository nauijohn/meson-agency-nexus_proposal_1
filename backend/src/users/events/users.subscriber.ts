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

import { hash } from "../../auth/utils/security";
import { CLS_USER_ID } from "../../common/constants";
import { UserCreatedEvent, UserEvents } from "../../common/events/user.events";
import { CreateUserDto } from "../dto";
import { User } from "../entities/user.entity";

@EventSubscriber()
@Injectable()
export class UsersSubscriber implements EntitySubscriberInterface<User> {
  constructor(
    dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
    private readonly cls: ClsService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    event.entity.createdBy = this.cls.get(CLS_USER_ID);
    if (event.entity?.password) {
      event.entity.password = await hash(event.entity.password);
    }
  }

  afterInsert(event: InsertEvent<User>): Promise<any> | void {
    this.detectRoleAssignmentEvents(event);
  }

  async beforeUpdate(event: UpdateEvent<User>): Promise<void> {
    if (event.entity?.password) {
      event.entity.password = await hash(String(event.entity.password));
    }

    if (event.entity?.updatedBy) {
      event.entity.updatedBy = this.cls.get<string>(CLS_USER_ID);
    }
  }

  private detectRoleAssignmentEvents(event: InsertEvent<User>): void {
    const dto = event.queryRunner.data as CreateUserDto;
    if (dto?.roles && dto.roles.length > 0) {
      this.eventEmitter.emit(
        UserEvents.Created,
        new UserCreatedEvent({
          userId: event.entity.id,
          roles: dto.roles,
          employeeRoles: dto.employeeRoles,
        }),
      );
    }
  }
}
