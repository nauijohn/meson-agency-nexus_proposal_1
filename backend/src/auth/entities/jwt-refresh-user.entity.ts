import { AutoMap } from "automapper-classes";

import { JwtUser } from "./jwt-user.entity";

export class JwtRefreshUser extends JwtUser {
  @AutoMap()
  tokenId: string;
}
