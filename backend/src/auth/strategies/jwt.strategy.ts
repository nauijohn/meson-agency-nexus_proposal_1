import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { ExtractJwt, Strategy } from "passport-jwt";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { LoggerService } from "../../common/global/logger/logger.service";
import { JwtUser } from "../entities/jwt-user.entity";
import { JwtPayload } from "../payload/jwt.payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly logger: LoggerService,
    @InjectMapper() private readonly mapper: Mapper,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET") || "",
      passReqToCallback: false,
    });
  }

  validate(payload: JwtPayload): JwtUser {
    this.logger.warn("JwtStrategy: validate called...");
    console.log("JWT Payload:", payload);
    if (!payload) throw new UnauthorizedException();
    const jwtUser = this.mapper.map(payload, JwtPayload, JwtUser);
    console.log("Validated JWT User:", jwtUser);
    return jwtUser;
  }
}
