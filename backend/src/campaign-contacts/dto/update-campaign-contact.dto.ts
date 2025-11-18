import { PartialType } from "@nestjs/mapped-types";

import { CreateCampaignContactDto } from "./create-campaign-contact.dto";

export class UpdateCampaignContactDto extends PartialType(
  CreateCampaignContactDto,
) {}
