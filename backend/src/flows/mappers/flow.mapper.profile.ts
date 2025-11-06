import {
  createMap,
  extend,
  type Mapper,
  MappingProfile,
} from "automapper-core";
import { AutomapperProfile, InjectMapper } from "automapper-nestjs";

import { Injectable } from "@nestjs/common";

import { CreateFlowDto } from "../dto/create-flow.dto";
import { UpdateFlowDto } from "../dto/update-flow.dto";
import { Flow } from "../entities/flow.entity";

@Injectable()
export class FlowProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreateFlowDto, Flow);
      createMap(mapper, UpdateFlowDto, Flow, extend(CreateFlowDto, Flow));
    };
  }
}
