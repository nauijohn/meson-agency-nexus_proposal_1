import { ClsService } from "nestjs-cls";

import { ExecutionContext, Injectable } from "@nestjs/common";
import { JsonWebTokenError, TokenExpiredError } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";

import { CLS_EMPLOYEE_ID, CLS_USER, CLS_USER_ID } from "../../common/constants";
import { LoggerService } from "../../common/global/logger/logger.service";
import { JwtRefreshUser } from "../entities/jwt-refresh-user.entity";

@Injectable()
export class RefreshTokenGuard extends AuthGuard("jwt-refresh") {
  constructor(
    private readonly cls: ClsService,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest<TUser = JwtRefreshUser>(
    err: Error,
    user: JwtRefreshUser,
    info: unknown,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    this.logger.verbose("JWT REFRESH TOKEN HandleRequest Guard");

    if (status) {
      this.logger.verbose(`status: ${status}`);
    }

    if (info) {
      if (info instanceof JsonWebTokenError) {
        this.logger.verbose("info: ", info);
        throw info;
      }

      if (
        !(info instanceof TokenExpiredError) &&
        !(info instanceof JsonWebTokenError)
      ) {
        this.logger.verbose("info: ", info);
      }
    }

    if (err) {
      this.logger.error("err: ", err);
      throw err;
    }

    // if (!user) throw new TokenExpiredError("Token expired", new Date());
    if (!user) throw new TokenExpiredError("test", new Date());

    this.cls.set<string>(CLS_USER_ID, user?.id);
    this.cls.set<string>(CLS_EMPLOYEE_ID, user?.employeeId);
    this.cls.set<JwtRefreshUser>(CLS_USER, user);

    return user as TUser;
  }
}
