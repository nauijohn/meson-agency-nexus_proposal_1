import { Strategy } from "passport-local";

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { LoggerService } from "../../common/global/logger/logger.service";
import { AuthService } from "../auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: LoggerService,
  ) {
    super({ usernameField: "email" });
  }

  async validate(username: string, password: string) {
    this.logger.log(`Validating user: ${username}`);
    const user = await this.authService.validateUser(username, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
