import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { EmployeeRolesModule } from "../employee-roles/employee-roles.module";
import { EmployeesService } from "./employees.service";
import { Employee } from "./entities/employee.entity";
import { EmployeeProfile } from "./mappers/employee.mapper.profile";

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), EmployeeRolesModule],
  providers: [EmployeesService, EmployeeProfile],
  exports: [EmployeesService],
})
export class EmployeesModule {}
