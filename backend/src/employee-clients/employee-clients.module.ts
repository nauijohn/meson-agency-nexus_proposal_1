import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeeClientsController } from "./employee-clients.controller";
import { EmployeeClientsService } from "./employee-clients.service";
import { EmployeeClient } from "./entities/employee-client.entity";
import { EmployeeClientProfile } from "./mappers/employee-client.mapper.profile";

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeClient])],
  controllers: [EmployeeClientsController],
  providers: [EmployeeClientsService, EmployeeClientProfile],
})
export class EmployeeClientsModule {}
