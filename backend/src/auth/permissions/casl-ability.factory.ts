import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from "@casl/ability";
import { Injectable } from "@nestjs/common";

import { Campaign } from "../../campaigns/entities/campaign.entity";
import { Client } from "../../clients";
import { EmployeeRoleType } from "../../employee-roles/entities/employee-role.entity";
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
      // Campaigns
      can(Action.Read, Campaign);

      // Clients
      can(Action.Read, Client);

      if (this.hasEmployeeRole(user, EmployeeRoleType.AGENT)) {
        cannot(Action.Create, Client);
        cannot(Action.Create, Campaign);
      }

      if (this.hasEmployeeRole(user, EmployeeRoleType.LEAD)) {
        can(Action.Create, Client);
        can(Action.Create, Campaign);
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
