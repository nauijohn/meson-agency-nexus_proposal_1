import { AutoMap } from "automapper-classes";

import { JwtPayload } from "./jwt.payload";

export class JwtRefreshPayload extends JwtPayload {
  @AutoMap()
  tokenId: string;
}
