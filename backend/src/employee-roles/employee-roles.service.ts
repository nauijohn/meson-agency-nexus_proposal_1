import { Repository } from "typeorm";

import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { EmployeeRole } from "./entities/employee-role.entity";

@Injectable()
export class EmployeeRolesService {
  constructor(
    @InjectRepository(EmployeeRole)
    private readonly repository: Repository<EmployeeRole>,
  ) {}

  findAll(): Promise<EmployeeRole[]> {
    return this.repository.find();
  }
}
