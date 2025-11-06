import { Expose, Type } from "class-transformer";

import { ClientDto } from "../../clients";
import { BaseDto } from "../../common/bases/base.dto";
import { RefreshTokenDto } from "../../refresh-tokens/dto/refresh-token.dto";
import { Role } from "../../roles";

export class UserDto extends BaseDto {
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
  @Type(() => RefreshTokenDto)
  refreshToken?: RefreshTokenDto;

  roles: Role[];
}
