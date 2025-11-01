import { Expose, Type } from "class-transformer";

import { ClientDto } from "../../clients/dto/client.dto";

export class CampaignDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

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
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
