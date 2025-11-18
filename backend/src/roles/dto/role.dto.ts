import { Expose } from "class-transformer";

import { BaseDto } from "../../common/bases/base.dto";
import { RoleType } from "../entities";

export class RoleDto extends BaseDto {
  @Expose()
  type: RoleType;
}
