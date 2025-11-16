import { AutoMap } from "automapper-classes";
import {
  IsEnum,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

import {
  ClientContactStatus,
  ClientContactType,
} from "../entities/client-contact.entity";

export class CreateClientContactDto {
  @IsNotEmpty()
  @IsString()
  @AutoMap()
  name: string;

  @IsNotEmpty()
  @IsMobilePhone()
  @AutoMap()
  contactNumber: string;

  @IsNotEmpty()
  @IsEnum(ClientContactType)
  @AutoMap()
  type: ClientContactType;

  @IsOptional()
  @IsEnum(ClientContactStatus)
  @AutoMap()
  status?: ClientContactStatus;

  @IsOptional()
  @IsString()
  clientId?: string;
}
