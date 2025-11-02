import { Expose } from "class-transformer";

export class FlowActivityDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
