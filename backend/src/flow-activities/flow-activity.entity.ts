import { Column, Entity } from "typeorm";

import { NamedEntity } from "../common/bases";

export enum ActivityType {
  email = "email",
  voice = "voice",
  sms = "sms",
  task = "task",
  webhook = "webhook",
}

@Entity({ name: "flow_activities" })
export class FlowActivity extends NamedEntity {
  @Column({ type: "enum", enum: ActivityType, unique: true })
  type: ActivityType;
}
