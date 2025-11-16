import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { UserCreatedEvent, UserEvents } from "../../common/events/user.events";
import { EmployeesService } from "../../employees/employees.service";
import { RoleType } from "../../roles/entities";

@Injectable()
export class UserEventsListener {
  constructor(private readonly employeesService: EmployeesService) {}

  @OnEvent(UserEvents.Created)
  handleUserCreationEvent(payload: UserCreatedEvent) {
    const { userId, roles, employeeRoles } = payload;

    for (const role of roles) {
      switch (role) {
        case RoleType.EMPLOYEE:
          console.log(`Employee role assigned to user with ID: ${userId}`);
          this.employeesService
            .create({
              userId: userId,
              employeeRoles: employeeRoles || [],
            })
            .then((employee) => {
              console.log("Employee record created for user ID: ", employee);
            })
            .catch((error) => {
              console.error("Error creating employee record: ", error);
            });
          break;

        default:
          console.log(`No specific actions for role: ${role}`);
          break;
      }
    }
  }
}
