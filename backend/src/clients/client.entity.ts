import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { Campaign } from "../campaigns/campaign.entity";
import { ClientContact } from "../client-contacts/client-contact.entity";
import { ClientNumber } from "../client-numbers/client-number.entity";

@Entity({ name: "clients" })
export class Client {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "business_name" })
  businessName: string;

  @Column()
  email: string;

  @Column({ name: "contact_person" })
  contactPerson: string;

  @Column({ name: "phone_number" })
  phoneNumber: string;

  @Column()
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

  @OneToMany(() => Campaign, (campaign) => campaign.client)
  campaigns: Campaign[];

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}

// | Column         | Type                       | Notes |
// | -------------- | -------------------------- | ----- |
// | id             | UUID (PK)                  |       |
// | business_name  | string                     |       |
// | contact_person | string                     |       |
// | email          | string                     |       |
// | phone_number   | string                     |       |
// | status         | enum(‘active’, ‘inactive’) |       |
// | created_at     | timestamp                  |       |
// | updated_at     | timestamp                  |       |
