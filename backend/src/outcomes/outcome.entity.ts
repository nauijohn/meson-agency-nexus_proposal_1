import { Column, Entity } from "typeorm";

import { NamedEntity } from "../common/bases";

@Entity({ name: "outcomes" })
export class Outcome extends NamedEntity {
  @Column({ type: "enum", enum: ["positive", "neutral", "negative"] })
  category: "positive" | "neutral" | "negative"; // new field

  @Column({ type: "boolean", default: true })
  isDefault: boolean; // system default or client custom
}
