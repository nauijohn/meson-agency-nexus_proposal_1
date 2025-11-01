import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserClient } from "./user-client.entity";
import { UserClientsController } from "./user-clients.controller";
import { UserClientsService } from "./user-clients.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserClient])],
  controllers: [UserClientsController],
  providers: [UserClientsService],
})
export class UserClientsModule {}
