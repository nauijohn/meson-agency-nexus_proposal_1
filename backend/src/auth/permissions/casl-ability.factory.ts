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
      cannot(Action.Create, Client);
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
}
