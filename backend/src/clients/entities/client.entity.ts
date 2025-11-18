import { AutoMap } from "automapper-classes";
import { Column, Entity, Unique } from "typeorm";

import { ClientRelationsEntity } from "./client-relations.entity";

@Entity({ name: "clients" })
@Unique(["name"])
export class Client extends ClientRelationsEntity {
  @Column()
  @AutoMap()
  businessName: string;

  @Column({ unique: true })
  @AutoMap()
  email: string;

  @Column()
  @AutoMap()
  contactPerson: string;

  @Column()
  @AutoMap()
  phoneNumber: string;

  @Column({ default: "active" })
  @AutoMap()
  status: "active" | "inactive";
}
