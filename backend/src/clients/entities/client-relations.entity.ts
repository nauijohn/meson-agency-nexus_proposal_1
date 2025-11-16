import { JoinTable, ManyToMany, OneToMany, OneToOne } from "typeorm";

import { Campaign } from "../../campaigns/entities/campaign.entity";
import { ClientContact } from "../../client-contacts/entities/client-contact.entity";
import { ClientNumber } from "../../client-numbers/client-number.entity";
import { NamedEntity } from "../../common/bases";
import { EmployeeClient } from "../../employee-clients/entities/employee-client.entity";
import { User } from "../../users";

export abstract class ClientRelationsEntity extends NamedEntity {
  @OneToMany(() => ClientContact, (contact) => contact.client, {
    cascade: true,
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

  @OneToMany(() => EmployeeClient, (ec) => ec.client)
  employeeClients: EmployeeClient[];

  // client.entity.ts
  @OneToOne(() => User, (user) => user.client)
  user: User;
}
