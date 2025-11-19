import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";

import { Campaign } from "../../campaigns/entities/campaign.entity";
import { EmployeeClient } from "../../employee-clients/entities/employee-client.entity";
import { EmployeeRoleType } from "../../employee-roles/entities/employee-role.entity";
import { Employee } from "../../employees/entities/employee.entity";
import { RoleType } from "../../roles/entities";
import { User } from "../../users";
import { JwtUser } from "../entities/jwt-user.entity";

export enum Action {
  Manage = "manage",
  Create = "create",
  Read = "read",
  Update = "update",
  Delete = "delete",
}

type Subjects = InferSubjects<typeof Campaign | typeof User> | "all";

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: JwtUser) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (this.hasRole(user, RoleType.SUPER_ADMIN)) can(Action.Manage, "all");

    if (this.hasRole(user, RoleType.EMPLOYEE)) {
      if (this.hasEmployeeRole(user, EmployeeRoleType.LEAD)) {
        can(Action.Create, "all");
        can(Action.Read, "all");
        cannot(Action.Create, Employee).because(
          "Only admins can create employees",
        );
      }

      if (this.hasEmployeeRole(user, EmployeeRoleType.AGENT)) {
        cannot(Action.Create, "all");
        cannot(Action.Create, EmployeeClient).because(
          "Agents cannot assign clients to employees",
        );

        cannot(Action.Delete, "all");
      }
    }

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  private hasRole(user: JwtUser, role: RoleType): boolean {
    return !!user?.roles?.includes(role);
  }

  private hasAnyRole(user: JwtUser, roles: RoleType[]): boolean {
    return roles.some((role) => user?.roles?.includes(role));
  }

  private hasEmployeeRole(user: JwtUser, role: EmployeeRoleType): boolean {
    return !!user?.employeeRoles?.includes(role);
  }
}
