import { AutoMap } from "automapper-classes";
import { Column, Entity, Unique } from "typeorm";

import { CampaignRelationsEntity } from "./campaign-relations.entity";

@Entity({ name: "campaigns" })
@Unique(["name"])
export class Campaign extends CampaignRelationsEntity {
  @Column({ type: "text", nullable: true })
  @AutoMap()
  description: string;

  @Column({ type: "date" })
  @AutoMap()
  startDate: Date;

  @Column({ type: "date", nullable: true })
  @AutoMap(() => Date)
  endDate: Date | null;

  @Column({ default: "active" })
  @AutoMap()
  status: "active" | "paused" | "completed";
}
