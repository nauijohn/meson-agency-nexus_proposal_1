import { ExtractJwt, Strategy } from "passport-jwt";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { LoggerService } from "../../common/global/logger/logger.service";

export type JwtPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

export type JwtUser = {
  id: string;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly logger: LoggerService,
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
    if (!payload) throw new UnauthorizedException();
    return { id: payload.sub, email: payload.email };
  }
}
