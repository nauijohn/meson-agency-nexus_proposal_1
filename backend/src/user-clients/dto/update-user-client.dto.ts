import { PartialType } from "@nestjs/mapped-types";

import { CreateUserClientDto } from "./create-user-client.dto";

export class UpdateUserClientDto extends PartialType(CreateUserClientDto) {}
