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

import { JwtRefreshUser } from "../entities/jwt-refresh-user.entity";
import { JwtUser } from "../entities/jwt-user.entity";
import { JwtRefreshPayload } from "../payload/jwt-refresh.payload";
import { JwtPayload } from "../payload/jwt.payload";

@Injectable()
export class AuthProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        JwtPayload,
        JwtUser,
        forMember(
          (dest: JwtUser) => dest.id,
          mapFrom((src: JwtPayload) => src.sub),
        ),
      );
      createMap(
        mapper,
        JwtRefreshPayload,
        JwtRefreshUser,
        extend(JwtPayload, JwtUser),
      );
    };
  }
}
