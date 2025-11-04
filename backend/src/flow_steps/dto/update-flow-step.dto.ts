import { PartialType } from "@nestjs/mapped-types";

import { CreateFlowStepDto } from "./create-flow-step.dto";

export class UpdateFlowStepDto extends PartialType(CreateFlowStepDto) {}
