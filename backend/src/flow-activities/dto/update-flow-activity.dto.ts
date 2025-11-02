import { PartialType } from "@nestjs/mapped-types";

import { CreateFlowActivityDto } from "./create-flow-activity.dto";

export class UpdateFlowActivityDto extends PartialType(CreateFlowActivityDto) {}
