import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserClient } from "./entities/user-client.entity";
import { UserClientProfile } from "./mappers/refresh-token.mapper.profile";
import { UserClientsController } from "./user-clients.controller";
import { UserClientsService } from "./user-clients.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserClient])],
  controllers: [UserClientsController],
  providers: [UserClientsService, UserClientProfile],
})
export class UserClientsModule {}
