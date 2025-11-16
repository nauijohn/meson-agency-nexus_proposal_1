import { Subject } from "@casl/ability";
import { SetMetadata } from "@nestjs/common";

import { Action } from "../permissions/casl-ability.factory";

export interface RequiredRule {
  action: Action;
  subject: Subject;
}

export const CHECK_ABILITY = "check_ability";

export const CheckAbilities = (...requirements: RequiredRule[]) => {
  return SetMetadata(CHECK_ABILITY, requirements);
};
