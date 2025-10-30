import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { RefreshToken } from "../refresh-tokens/refresh-token.entity";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => RefreshToken, (refreshToken) => refreshToken.user, {
    cascade: true,
    eager: true,
    onDelete: "SET NULL",
  })
  @JoinColumn()
  refreshToken?: RefreshToken;
}
