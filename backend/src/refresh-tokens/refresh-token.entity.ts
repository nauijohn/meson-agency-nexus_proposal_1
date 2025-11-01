import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { User } from "../users";

@Entity({ name: "refresh-tokens" })
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "token", unique: true, nullable: true })
  token: string;

  @OneToOne(() => User, (user) => user.refreshToken)
  user?: User;
}
