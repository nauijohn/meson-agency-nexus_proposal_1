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
import { CreateRefreshTokenDto } from "../dto/create-refresh-token.dto";
import { UpdateRefreshTokenDto } from "../dto/update-refresh-token.dto";
import { RefreshToken } from "../entities/refresh-token.entity";

@Injectable()
export class RefreshTokenProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateRefreshTokenDto,
        RefreshToken,
        forMember(
          (dest: RefreshToken) => dest.user,
          mapFrom((src: CreateRefreshTokenDto) => idRefMapper(src.userId)),
        ),
      );
      createMap(
        mapper,
        UpdateRefreshTokenDto,
        RefreshToken,
        extend(CreateRefreshTokenDto, RefreshToken),
      );
    };
  }

  // protected get mappingConfigurations(): MappingConfiguration[] {
  //   // the 3 createMap() above will get this `extend()`
  //   return [extend(BaseEntity, BaseDto)];
  // }
}
