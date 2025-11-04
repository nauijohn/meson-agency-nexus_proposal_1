import { ExtractJwt, Strategy } from "passport-jwt";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";

import { JwtPayload, JwtUser } from "./jwt.strategy";

export type JwtRefreshUser = JwtUser & {
  tokenId: string;
};

type JwtRefreshPayload = JwtPayload & {
  tokenId: string;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getOrThrow("JWT_REFRESH_TOKEN_SECRET"),
      passReqToCallback: false,
    });
  }

  validate(payload: JwtRefreshPayload): JwtRefreshUser {
    console.log("validate RefreshTokenStrategy22", payload);
    if (!payload) throw new UnauthorizedException();
    return { id: payload.sub, email: payload.email, tokenId: payload.tokenId };
  }
}
