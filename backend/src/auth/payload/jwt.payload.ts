import { AutoMap } from "automapper-classes";

import { RoleType } from "../../roles/entities";

export class JwtPayload {
  sub: string;

  @AutoMap()
  email: string;

  @AutoMap({ type: () => Array<RoleType> })
  roles: RoleType[];

  iat: number;

  exp: number;
}
