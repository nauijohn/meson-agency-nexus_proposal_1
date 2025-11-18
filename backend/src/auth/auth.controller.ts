import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UnprocessableEntityException,
  UseGuards,
} from "@nestjs/common";

import { Public } from "../common/decorators/is-public.decorator";
import { RefreshTokensService } from "../refresh-tokens/refresh-tokens.service";
import { RoleType } from "../roles/entities";
import { User, UsersService } from "../users/";
import { AuthService } from "./auth.service";
import { BearerToken } from "./decorators/bearer-token.decorator";
import { ReqUser } from "./decorators/req-user.decorator";
import { SignUpDto } from "./dto";
import { JwtRefreshUser } from "./entities/jwt-refresh-user.entity";
import { JwtUser } from "./entities/jwt-user.entity";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { RefreshTokenGuard } from "./guards/refresh-token.guard";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly refreshTokensService: RefreshTokensService,
  ) {}

  @Public()
  @Post("sign-up")
  async signUp(@Body() request: SignUpDto) {
    let user = await this.usersService.findByEmail(request.email);
    if (user) {
      throw new UnprocessableEntityException("User already exists");
    }

    user = await this.usersService.create({
      ...request,
      roles: [RoleType.USER],
    });
    if (!user) {
      throw new InternalServerErrorException("Error creating user");
    }

    const tokens = this.authService.createTokens(user);

    const refreshToken = await this.refreshTokensService.create({
      userId: user.id,
      token: tokens.refreshToken,
    });
    if (!refreshToken) {
      throw new InternalServerErrorException("Error creating refreshToken");
    }

    return tokens;
  }

  @Public()
  @Post("sign-in")
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async signIn(@ReqUser() user: User) {
    let { refreshToken } = user;
    const tokens = this.authService.createTokens(user);

    if (!refreshToken) {
      refreshToken = await this.refreshTokensService.create({
        token: tokens.refreshToken,
        userId: user.id,
      });
    } else {
      refreshToken = await this.refreshTokensService.update(refreshToken, {
        token: tokens.refreshToken,
      });
    }

    if (!refreshToken) throw new InternalServerErrorException();

    return tokens;
  }

  @Public()
  @Post("sign-out")
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async signOut(@ReqUser() user: JwtRefreshUser) {
    if (!user?.tokenId) throw new BadRequestException();
    await this.refreshTokensService.delete(user.tokenId);
  }

  @Public()
  @Post("refresh-token")
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshTokenGuard)
  async refreshToken(
    @ReqUser() reqUser: JwtRefreshUser,
    @BearerToken() bearerToken: string,
  ) {
    const tokens = await this.authService.refreshTokens(
      reqUser.id,
      bearerToken,
    );
    if (!tokens) throw new InternalServerErrorException("Invalid Token");
    return tokens;
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  me(@ReqUser() user: JwtUser) {
    return user;
  }
}
