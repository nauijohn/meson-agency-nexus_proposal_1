import { AutoMap } from "automapper-classes";
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  RelationId,
} from "typeorm";

import { Client } from "../../clients";
import { User } from "../../users";

@Entity({ name: "user_clients" })
export class UserClient {
  @PrimaryColumn("uuid", { name: "user_id" })
  @RelationId((userClient: UserClient) => userClient.user)
  @AutoMap()
  userId: string;

  @PrimaryColumn("uuid", { name: "client_id" })
  @RelationId((userClient: UserClient) => userClient.client)
  @AutoMap()
  clientId: string;

  @ManyToOne(() => User, (user) => user.userClients, {
    eager: true,
    onDelete: "NO ACTION",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Client, (client) => client.users, {
    eager: true,
    onDelete: "NO ACTION",
  })
  @JoinColumn({ name: "client_id" })
  client: Client;

  @CreateDateColumn()
  assignedDate: Date;
}
