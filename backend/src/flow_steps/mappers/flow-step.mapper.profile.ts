import {
  createMap,
  extend,
  forMember,
  mapFrom,
  type Mapper,
  MappingProfile,
} from "automapper-core";
import { AutomapperProfile, InjectMapper } from "automapper-nestjs";

import { Injectable } from "@nestjs/common";

import { CreateFlowStepDto } from "../dto/create-flow-step.dto";
import { UpdateFlowStepDto } from "../dto/update-flow-step.dto";
import { FlowStep } from "../entities/flow-step.entity";

@Injectable()
export class FlowStepProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateFlowStepDto,
        FlowStep,
        forMember(
          (dest: FlowStep) => dest.stepActivities,
          mapFrom(
            (source: CreateFlowStepDto) =>
              source.activities.map((id) => ({ id })), // transform string ID → object with id
          ),
        ),
      );
      createMap(
        mapper,
        UpdateFlowStepDto,
        FlowStep,
        extend(CreateFlowStepDto, FlowStep),
      );
    };
  }
}
