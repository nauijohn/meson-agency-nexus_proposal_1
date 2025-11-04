import { Expose, Type } from "class-transformer";

import { ClientDto } from "../../clients/dto/client.dto";
import { BaseDto } from "../../common/bases/base.dto";
import { FlowDto } from "../../flows/dto/flow.dto";

export class CampaignDto extends BaseDto {
  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date | null;

  @Expose()
  status: "active" | "paused" | "completed";

  @Expose()
  @Type(() => ClientDto)
  client: ClientDto;

  @Expose()
  @Type(() => FlowDto)
  flow: FlowDto;
}
