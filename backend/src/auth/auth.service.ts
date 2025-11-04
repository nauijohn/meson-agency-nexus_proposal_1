import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";

import { User, UsersService } from "../users/";
import { compare } from "./utils/security";

type TokenPayload = {
  sub: string;
  email: string;
  tokenId?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return;

    const isMatch = await compare(password, user.password);
    if (!isMatch) return;

    return user;
  }

  createTokens(user: User) {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
    };
    const accessToken = this.createToken(payload);
    const refreshToken = this.createToken(
      { ...payload, tokenId: user.refreshToken?.id },
      {
        secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
        expiresIn: this.configService.get("JWT_REFRESH_TOKEN_EXPIRES_IN"),
      },
    );

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, token: string) {
    let user = await this.usersService.findOne(userId);
    if (!user?.refreshToken) return;

    const isTokenValid = await compare(token, user.refreshToken.token);
    if (!isTokenValid) return;

    const tokens = this.createTokens(user);

    user = await this.usersService.update(user, {
      refreshToken: tokens.refreshToken,
    });
    if (!user) return;

    return tokens;
  }

  private createToken(payload: TokenPayload, opts?: JwtSignOptions) {
    return this.jwtService.sign(payload, opts);
  }
}
