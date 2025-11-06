import {
  createMap,
  extend,
  type Mapper,
  MappingProfile,
} from "automapper-core";
import { AutomapperProfile, InjectMapper } from "automapper-nestjs";

import { Injectable } from "@nestjs/common";

import { CreateClientDto, UpdateClientDto } from "../dto";
import { Client } from "../entities/client.entity";

@Injectable()
export class ClientProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreateClientDto, Client);
      createMap(
        mapper,
        UpdateClientDto,
        Client,
        extend(CreateClientDto, Client),
      );
    };
  }
}
