import {
  createMap,
  extend,
  type Mapper,
  MappingProfile,
} from "automapper-core";
import { AutomapperProfile, InjectMapper } from "automapper-nestjs";

import { Injectable } from "@nestjs/common";

import { CreateUserDto, UpdateUserDto } from "../dto";
import { User } from "../entities/user.entity";

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreateUserDto, User);
      createMap(mapper, UpdateUserDto, User, extend(CreateUserDto, User));
    };
  }

  // protected get mappingConfigurations(): MappingConfiguration[] {
  //   // the 3 createMap() above will get this `extend()`
  //   return [extend(BaseEntity, BaseDto)];
  // }
}
