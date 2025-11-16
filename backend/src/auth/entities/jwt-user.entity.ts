import { AutoMap } from "automapper-classes";

import { RoleType } from "../../roles/entities";

export class JwtUser {
  id: string;

  @AutoMap()
  email: string;

  @AutoMap({ type: () => Array<RoleType> })
  roles: RoleType[];
}
