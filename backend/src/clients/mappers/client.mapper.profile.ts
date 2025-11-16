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

import { CreateClientDto, UpdateClientDto } from "../dto";
import { Client } from "../entities/client.entity";

@Injectable()
export class ClientProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateClientDto,
        Client,
        forMember(
          (dest: Client) => dest.contacts,
          mapFrom((src: CreateClientDto) =>
            src.contacts?.map((c) => ({
              name: c.name,
              contactNumber: c.contactNumber,
            })),
          ),
        ),
      );
      createMap(
        mapper,
        UpdateClientDto,
        Client,
        extend(CreateClientDto, Client),
      );
    };
  }
}
