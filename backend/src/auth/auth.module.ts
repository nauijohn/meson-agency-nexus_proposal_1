import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { RefreshTokensModule } from "../refresh-tokens/";
import { UsersModule } from "../users/";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthProfile } from "./mappers/auth.mapper.profile";
import { CaslAbilityFactory } from "./permissions/casl-ability.factory";
import { JwtStrategy } from "./strategies";
import { LocalStrategy } from "./strategies/local.strategy";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get("JWT_EXPIRES_IN"),
        },
      }),
    }),
    UsersModule,
    RefreshTokensModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    RefreshTokenStrategy,
    JwtStrategy,
    CaslAbilityFactory,
    AuthProfile,
  ],
  exports: [CaslAbilityFactory],
})
export class AuthModule {}
