import {
  createMap,
  extend,
  forMember,
  mapFrom,
  type Mapper,
  MappingProfile,
} from "automapper-core";
import { AutomapperProfile, InjectMapper } from "automapper-nestjs";

import { Injectable } from "@nestjs/common";

import { idRefMapper } from "../../common/mappers";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { UpdateEmployeeDto } from "../dto/update-employee.dto";
import { Employee } from "../entities/employee.entity";

@Injectable()
export class EmployeeProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateEmployeeDto,
        Employee,
        forMember(
          (dest: Employee) => dest.user,
          mapFrom((src: CreateEmployeeDto) => idRefMapper(src.userId)),
        ),
      );
      createMap(
        mapper,
        UpdateEmployeeDto,
        Employee,
        extend(CreateEmployeeDto, Employee),
      );
    };
  }
}
