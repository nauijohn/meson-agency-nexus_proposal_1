import { IsString } from "class-validator";

export class CreateUserClientDto {
  @IsString()
  userId: string;

  @IsString()
  clientId: string;
}
