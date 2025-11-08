import { JoinTable, ManyToMany, OneToMany } from "typeorm";

import { Campaign } from "../../campaigns/entities/campaign.entity";
import { ClientContact } from "../../client-contacts/entities/client-contact.entity";
import { ClientNumber } from "../../client-numbers/client-number.entity";
import { NamedEntity } from "../../common/bases";
import { UserClient } from "../../user-clients/entities/user-client.entity";

export abstract class ClientRelationsEntity extends NamedEntity {
  @ManyToMany(() => ClientContact, (contact) => contact.clients, {
    cascade: true,
  })
  @JoinTable({
    name: "client_client_contacts", // join table name
    joinColumn: { name: "client_id", referencedColumnName: "id" },
    inverseJoinColumn: {
      name: "client_contact_id",
      referencedColumnName: "id",
    },
  })
  contacts: ClientContact[];

  // @OneToMany(() => ClientClientContact, (ccc) => ccc.client)
  // clientClientContacts: ClientClientContact[];

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
