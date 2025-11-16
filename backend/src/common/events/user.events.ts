import { EmployeeRoleType } from "../../employee-roles/entities/employee-role.entity";
import { RoleType } from "../../roles/entities";

export enum UserEvents {
  Created = "user.created",
}

interface UserCreatedEventPayload {
  userId: string;
  roles: RoleType[];
  employeeRoles?: EmployeeRoleType[];
}

export class UserCreatedEvent {
  constructor(private readonly payload: UserCreatedEventPayload) {}

  get userId() {
    return this.payload.userId;
  }

  get roles() {
    return this.payload.roles;
  }

  get employeeRoles() {
    return this.payload.employeeRoles;
  }
}
