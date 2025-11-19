import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeeRolesModule } from "../employee-roles/employee-roles.module";
import { EmployeesController } from "./employees.controller";
import { EmployeesService } from "./employees.service";
import { Employee } from "./entities/employee.entity";
import { EmployeeProfile } from "./mappers/employee.mapper.profile";

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), EmployeeRolesModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeeProfile],
  exports: [EmployeesService],
})
export class EmployeesModule {}
