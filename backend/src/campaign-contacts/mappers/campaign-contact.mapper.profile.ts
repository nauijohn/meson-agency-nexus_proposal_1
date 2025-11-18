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
import { CreateCampaignContactDto } from "../dto/create-campaign-contact.dto";
import { UpdateCampaignContactDto } from "../dto/update-campaign-contact.dto";
import { CampaignContact } from "../entities/campaign-contact.entity";

@Injectable()
export class CampaignContactProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(
        mapper,
        CreateCampaignContactDto,
        CampaignContact,
        forMember(
          (dest: CampaignContact) => dest.clientContact,
          mapFrom((src: CreateCampaignContactDto) =>
            idRefMapper(src.clientContactId),
          ),
        ),
        forMember(
          (dest: CampaignContact) => dest.campaign,
          mapFrom((src: CreateCampaignContactDto) =>
            idRefMapper(src.campaignId),
          ),
        ),
      );
      createMap(
        mapper,
        UpdateCampaignContactDto,
        CampaignContact,
        extend(CreateCampaignContactDto, CampaignContact),
      );
    };
  }
}
