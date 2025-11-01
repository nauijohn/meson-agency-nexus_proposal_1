import { Expose, Type } from "class-transformer";

import { ClientDto } from "../../clients";
import { RefreshToken } from "../../refresh-tokens";
import { Role } from "../../roles";

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => ClientDto)
  clients: ClientDto[];

  @Expose()
  @Type(() => ClientDto)
  unassignedClients: ClientDto[];

  @Expose()
  refreshToken?: RefreshToken;

  roles: Role[];
}
