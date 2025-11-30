import type { Mapper } from "automapper-core";
import { InjectMapper } from "automapper-nestjs";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { LoggerService } from "../../common/global/logger/logger.service";
import { JwtRefreshUser } from "../entities/jwt-refresh-user.entity";
import { JwtRefreshPayload } from "../payload/jwt-refresh.payload";

const cookieExtractor = (req: Request): string | null => {
  if (req && req.cookies && req.cookies.refreshToken) {
    return req.cookies.refreshToken as string;
  }
  return null;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(
    private readonly logger: LoggerService,
    @InjectMapper() private readonly mapper: Mapper,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow("JWT_REFRESH_TOKEN_SECRET"),
      passReqToCallback: false,
    });
  }

  validate(payload: JwtRefreshPayload): JwtRefreshUser {
    if (!payload) throw new UnauthorizedException();
    const jwtRefreshUser = this.mapper.map(
      payload,
      JwtRefreshPayload,
      JwtRefreshUser,
    );
    return jwtRefreshUser;
  }
}
