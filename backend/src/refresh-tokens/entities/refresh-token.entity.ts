import { AutoMap } from "automapper-classes";
import { Column, Entity, OneToOne } from "typeorm";

import { BaseEntity } from "../../common/bases";
import { User } from "../../users";

@Entity({ name: "refresh_tokens" })
export class RefreshToken extends BaseEntity {
  @Column({ unique: true, nullable: true })
  @AutoMap()
  token: string;

  @OneToOne(() => User, (user) => user.refreshToken)
  user?: User;
}
