import {
  createMap,
  extend,
  type Mapper,
  MappingProfile,
} from "automapper-core";
import { AutomapperProfile, InjectMapper } from "automapper-nestjs";

import { Injectable } from "@nestjs/common";

import { CreateFlowStepActivityDto } from "../dto/create-flow-step-activity.dto";
import { UpdateFlowStepActivityDto } from "../dto/update-flow-step-activity.dto";
import { FlowStepActivity } from "../entities/flow-step-activity.entity";

@Injectable()
export class FlowStepActivityProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreateFlowStepActivityDto, FlowStepActivity);
      createMap(
        mapper,
        UpdateFlowStepActivityDto,
        FlowStepActivity,
        extend(CreateFlowStepActivityDto, FlowStepActivity),
      );
    };
  }
}
