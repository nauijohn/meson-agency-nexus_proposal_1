import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { UserCreatedEvent, UserEvents } from "../../common/events/user.events";
import { LoggerService } from "../../common/global/logger/logger.service";
import { EmployeesService } from "../../employees/employees.service";
import { RoleType } from "../../roles/entities";

@Injectable()
export class UserEventsListener {
  constructor(
    private readonly logger: LoggerService,
    private readonly employeesService: EmployeesService,
  ) {}

  @OnEvent(UserEvents.Created)
  handleUserCreationEvent(payload: UserCreatedEvent) {
    const { userId, roles, employeeRoles } = payload;

    for (const role of roles) {
      switch (role) {
        case RoleType.EMPLOYEE:
          this.employeesService
            .create({
              userId: userId,
              employeeRoles: employeeRoles || [],
            })
            .then((employee) => {
              this.logger.log(
                "Employee record created for user ID: ",
                employee,
              );
            })
            .catch((error) => {
              this.logger.error("Error creating employee record: ", error);
            });
          break;

        default:
          this.logger.warn(`No specific actions for role: ${role}`);
          break;
      }
    }
  }
}
