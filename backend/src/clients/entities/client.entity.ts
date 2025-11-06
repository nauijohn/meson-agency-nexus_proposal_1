import { AutoMap } from "automapper-classes";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

import { Campaign } from "../../campaigns/entities/campaign.entity";
import { ClientContact } from "../../client-contacts/client-contact.entity";
import { ClientNumber } from "../../client-numbers/client-number.entity";
import { NamedEntity } from "../../common/bases";
import { UserClient } from "../../user-clients/entities/user-client.entity";

@Entity({ name: "clients" })
export class Client extends NamedEntity {
  @Column({ name: "business_name" })
  @AutoMap()
  businessName: string;

  @Column({ unique: true })
  @AutoMap()
  email: string;

  @Column({ name: "contact_person" })
  @AutoMap()
  contactPerson: string;

  @Column({ name: "phone_number" })
  @AutoMap()
  phoneNumber: string;

  @Column({ default: "active" })
  @AutoMap()
  status: "active" | "inactive";

  @ManyToMany(() => ClientContact, (contact) => contact.clients)
  @JoinTable({
    name: "client_client_contacts", // join table name
    joinColumn: { name: "client_id", referencedColumnName: "id" },
    inverseJoinColumn: {
      name: "client_contact_id",
      referencedColumnName: "id",
    },
  })
  contacts: ClientContact[];

  @ManyToMany(() => ClientNumber, (number) => number.clients)
  @JoinTable({
    name: "client_client_numbers", // join table name
    joinColumn: { name: "client_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "number_id", referencedColumnName: "id" },
  })
  numbers: ClientNumber[];

  @OneToMany(() => Campaign, (campaign) => campaign.client, {
    eager: false,
    cascade: false,
  })
  campaigns: Campaign[];

  // client.entity.ts
  @OneToMany(() => UserClient, (uc) => uc.client)
  users: UserClient[];
}
