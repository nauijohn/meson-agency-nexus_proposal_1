import {
  createMap,
  extend,
  type Mapper,
  MappingProfile,
} from "automapper-core";
import { AutomapperProfile, InjectMapper } from "automapper-nestjs";

import { Injectable } from "@nestjs/common";

import { CreateUserClientDto } from "../dto/create-user-client.dto";
import { UpdateUserClientDto } from "../dto/update-user-client.dto";
import { UserClient } from "../entities/user-client.entity";

@Injectable()
export class UserClientProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreateUserClientDto, UserClient);
      createMap(
        mapper,
        UpdateUserClientDto,
        UserClient,
        extend(CreateUserClientDto, UserClient),
      );
    };
  }
}
