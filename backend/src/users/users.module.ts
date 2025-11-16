import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { RolesModule } from "../roles/roles.module";
import { User } from "./entities/user.entity";
import { UsersSubscriber } from "./events/users.subscriber";
import { UserProfile } from "./mappers/user.mapper.profile";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersSubscriber, UserProfile],
  exports: [UsersService],
})
export class UsersModule {}
