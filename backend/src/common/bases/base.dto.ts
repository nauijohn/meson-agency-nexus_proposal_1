import { Expose } from "class-transformer";

export class BaseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  createdBy?: string;

  @Expose()
  updatedBy?: string;
}
