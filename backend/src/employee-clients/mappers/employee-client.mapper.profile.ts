import {
  createMap,
  extend,
  type Mapper,
  MappingProfile,
} from "automapper-core";
import { AutomapperProfile, InjectMapper } from "automapper-nestjs";

import { Injectable } from "@nestjs/common";

import { CreateEmployeeClientDto } from "../dto/create-employee-client.dto";
import { UpdateEmployeeClientDto } from "../dto/update-employee-client.dto";
import { EmployeeClient } from "../entities/employee-client.entity";

@Injectable()
export class EmployeeClientProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, CreateEmployeeClientDto, EmployeeClient);
      createMap(
        mapper,
        UpdateEmployeeClientDto,
        EmployeeClient,
        extend(CreateEmployeeClientDto, EmployeeClient),
      );
    };
  }
}
