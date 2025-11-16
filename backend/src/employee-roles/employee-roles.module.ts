import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeeRolesService } from "./employee-roles.service";
import { EmployeeRole } from "./entities/employee-role.entity";

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeRole])],
  providers: [EmployeeRolesService],
  exports: [EmployeeRolesService],
})
export class EmployeeRolesModule {}
