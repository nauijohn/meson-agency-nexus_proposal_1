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
import { CreateCampaignDto } from "../dto/create-campaign.dto";
import { UpdateCampaignDto } from "../dto/update-campaign.dto";
import { Campaign } from "../entities/campaign.entity";

@Injectable()
export class CampaignProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateCampaignDto,
        Campaign,
        forMember(
          (dest: Campaign) => dest.client,
          mapFrom((src: CreateCampaignDto) => idRefMapper(src.clientId)),
        ),
        forMember(
          (dest: Campaign) => dest.flow,
          mapFrom((src: CreateCampaignDto) => idRefMapper(src.flowId)),
        ),
      );

      createMap(
        mapper,
        UpdateCampaignDto,
        Campaign,
        extend(CreateCampaignDto, Campaign),
      );
    };
  }
}
