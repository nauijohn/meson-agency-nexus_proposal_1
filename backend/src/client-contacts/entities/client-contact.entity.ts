import { AutoMap } from "automapper-classes";
import { Column, Entity, ManyToOne } from "typeorm";

import { Client } from "../../clients";
import { NamedEntity } from "../../common/bases";

export enum ClientContactType {
  MOBILE = "mobile",
  HOME = "home",
  WORK = "work",
  OTHER = "other",
}

export enum ClientContactStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DO_NOT_CALL = "do_not_call",
}

@Entity({ name: "client_contacts" })
export class ClientContact extends NamedEntity {
  @Column()
  @AutoMap()
  contactNumber: string;

  @Column({
    type: "enum",
    enum: ClientContactType,
    default: ClientContactType.MOBILE,
  })
  @AutoMap()
  type: ClientContactType;

  @Column({
    type: "enum",
    enum: ClientContactStatus,
    default: ClientContactStatus.ACTIVE,
  })
  @AutoMap()
  status: ClientContactStatus;

  @Column({ type: "boolean", default: false })
  preferred: boolean;

  // // Many-to-many: contact ↔ clients
  // @ManyToMany(() => Client, (client) => client.contacts)
  // clients: Client[];

  @ManyToOne(() => Client, (client) => client.contacts, {
    nullable: false,
    onDelete: "CASCADE",
  })
  client: Client;

  // @OneToMany(() => ClientClientContact, (ccc) => ccc.clientContact)
  // clientClientContacts: ClientClientContact[];
}
