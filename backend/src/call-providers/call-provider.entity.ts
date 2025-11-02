import { Column, Entity } from "typeorm";

import { NamedEntity } from "../common/bases";

@Entity({ name: "call_providers" })
export class CallProvider extends NamedEntity {
  @Column({ nullable: true })
  description: string;
}
