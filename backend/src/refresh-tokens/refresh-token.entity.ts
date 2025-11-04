import { Column, Entity, OneToOne } from "typeorm";

import { BaseEntity } from "../common/bases";
import { User } from "../users";

@Entity({ name: "refresh_tokens" })
export class RefreshToken extends BaseEntity {
  @Column({ name: "token", unique: true, nullable: true })
  token: string;

  @OneToOne(() => User, (user) => user.refreshToken)
  user?: User;
}
