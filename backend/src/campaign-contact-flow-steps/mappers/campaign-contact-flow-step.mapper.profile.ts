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
import { CreateCampaignContactFlowStepDto } from "../dto/create-campaign-contact-flow-step.dto";
import { UpdateCampaignContactFlowStepDto } from "../dto/update-campaign-contact-flow-step.dto";
import { CampaignContactFlowStep } from "../entities/campaign-contact-flow-step.entity";

@Injectable()
export class CampaignContactFlowStepProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateCampaignContactFlowStepDto,
        CampaignContactFlowStep,
        forMember(
          (dest: CampaignContactFlowStep) => dest.clientContact,
          mapFrom((src: CreateCampaignContactFlowStepDto) =>
            idRefMapper(src.clientContactId),
          ),
        ),
      );
      createMap(
        mapper,
        UpdateCampaignContactFlowStepDto,
        CampaignContactFlowStep,
        extend(CreateCampaignContactFlowStepDto, CampaignContactFlowStep),
      );
    };
  }
}
