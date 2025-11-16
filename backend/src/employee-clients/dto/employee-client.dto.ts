import { Expose, Type } from "class-transformer";

import { ClientDto } from "../../clients";
import { UserDto } from "../../users/dto/user.dto";

export class EmployeeClientDto {
  @Expose()
  @Type(() => UserDto)
  employee: UserDto;

  @Expose()
  @Type(() => ClientDto)
  client: ClientDto;

  @Expose()
  assignedDate: Date;
}
