import { Column, Entity } from "typeorm";

import { CampaignContactRelations } from "./campaign-contact-relations.entity";

export enum CampaignContactStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  STOPPED = "stopped",
}

@Entity({ name: "campaign_contacts" })
export class CampaignContact extends CampaignContactRelations {
  @Column({
    type: "enum",
    enum: CampaignContactStatus,
    default: CampaignContactStatus.NOT_STARTED,
  })
  status: CampaignContactStatus;

  @Column({ type: "timestamp", nullable: true, default: null })
  startedAt?: Date | null;

  @Column({ type: "timestamp", nullable: true, default: null })
  completedAt?: Date | null;

  @Column({ type: "boolean", default: false })
  isConnected: boolean;
}
