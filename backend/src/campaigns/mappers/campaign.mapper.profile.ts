import {
  convertUsing,
  createMap,
  extend,
  forMember,
  type Mapper,
  MappingProfile,
} from "automapper-core";
import { AutomapperProfile, InjectMapper } from "automapper-nestjs";

import { Injectable } from "@nestjs/common";

import { clientRefConverter } from "../../common/mappers";
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
          convertUsing(
            clientRefConverter,
            (src: CreateCampaignDto) => src.clientId,
          ),
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
