import { PartialType } from "@nestjs/mapped-types";

import { CreateEmployeeClientDto } from "./create-employee-client.dto";

export class UpdateEmployeeClientDto extends PartialType(
  CreateEmployeeClientDto,
) {}
