import {
  createMap,
  extend,
  type Mapper,
  MappingProfile,
} from "automapper-core";
import { AutomapperProfile, InjectMapper } from "automapper-nestjs";

import { Injectable } from "@nestjs/common";

import { CreateFlowActivityDto } from "../dto/create-flow-activity.dto";
import { UpdateFlowActivityDto } from "../dto/update-flow-activity.dto";
import { FlowActivity } from "../entities/flow-activity.entity";

@Injectable()
export class FlowActivityProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreateFlowActivityDto, FlowActivity);
      createMap(
        mapper,
        UpdateFlowActivityDto,
        FlowActivity,
        extend(CreateFlowActivityDto, FlowActivity),
      );
    };
  }
}
