import { Expose } from "class-transformer";

import { BaseDto } from "../../common/bases/base.dto";

export class RefreshTokenDto extends BaseDto {
  @Expose()
  token: string;
}
