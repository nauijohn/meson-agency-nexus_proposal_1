import { CreateDateColumn, PrimaryColumn } from "typeorm";

// @Entity({ name: "client_client_contacts" })
export class ClientClientContact {
  @PrimaryColumn("uuid", { name: "client_id" })
  clientId: string;

  @PrimaryColumn("uuid", { name: "client_contact_id" })
  clientContactId: string;

  // @ManyToOne(() => Client, (client) => client.clientClientContacts, {
  //   onDelete: "CASCADE",
  // })
  // @JoinColumn({ name: "client_id" })
  // client: Client;

  // @ManyToOne(() => ClientContact, (contact) => contact.clientClientContacts, {
  //   onDelete: "CASCADE",
  // })
  // @JoinColumn({ name: "client_contact_id" })
  // clientContact: ClientContact;

  @CreateDateColumn()
  linkedAt: Date;
}
