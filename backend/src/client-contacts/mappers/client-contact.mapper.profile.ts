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

import { idRefMapper } from "../../common/mappers";
import { CreateClientContactDto } from "../dto/create-client-contact.dto";
import { UpdateClientContactDto } from "../dto/update-client-contact.dto";
import { ClientContact } from "../entities/client-contact.entity";

@Injectable()
export class ClientContactProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateClientContactDto,
        ClientContact,
        forMember(
          (dest: ClientContact) => dest.client,
          mapFrom((src: CreateClientContactDto) => idRefMapper(src.clientId)),
        ),
      );
      createMap(
        mapper,
        UpdateClientContactDto,
        ClientContact,
        extend(CreateClientContactDto, ClientContact),
      );
    };
  }
}
