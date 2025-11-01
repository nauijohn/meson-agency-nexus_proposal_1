import { Expose, Type } from "class-transformer";

import { ClientDto } from "../../clients";
import { UserDto } from "../../users/dto/user.dto";

export class UserClientDto {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;

  @Expose()
  @Type(() => ClientDto)
  client: ClientDto;
}
