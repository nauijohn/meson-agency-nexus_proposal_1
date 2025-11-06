import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RefreshToken } from "./entities/refresh-token.entity";
import { RefreshTokenProfile } from "./mappers/refresh-token.mapper.profile";
import { RefreshTokensService } from "./refresh-tokens.service";

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  providers: [RefreshTokensService, RefreshTokenProfile],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
