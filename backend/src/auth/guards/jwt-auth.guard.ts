import { ClsService } from "nestjs-cls";
import { Observable } from "rxjs";

import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JsonWebTokenError, TokenExpiredError } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";

import { CLS_EMPLOYEE_ID, CLS_USER, CLS_USER_ID } from "../../common/constants";
import { IS_PUBLIC_KEY } from "../../common/decorators/is-public.decorator";
import { LoggerService } from "../../common/global/logger/logger.service";
import { JwtUser } from "../entities/jwt-user.entity";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(
    private readonly logger: LoggerService,
    private readonly reflector: Reflector,
    private readonly cls: ClsService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      this.logger.warn("Public route accessed, skipping JWT authentication.");
      return true;
    }

    this.logger.warn("JWT Auth Guard: canActivate called...");
    return super.canActivate(context);
  }

  handleRequest<TUser = JwtUser>(
    err: Error,
    user: JwtUser,
    info: unknown,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    this.logger.verbose("JWT HandleRequest Guard");

    if (status) {
      this.logger.log("status: ", status);
    }

    if (info) {
      if (info instanceof JsonWebTokenError) {
        throw info;
      }

      if (!TokenExpiredError && !JsonWebTokenError) {
        this.logger.verbose("info: ", info);
      }
    }

    if (err) {
      this.logger.error("err: ", err);
      throw err;
    }

    if (!user) throw new TokenExpiredError("Token expired", new Date());

    this.cls.set<string>(CLS_USER_ID, user?.id);
    this.cls.set<string>(CLS_EMPLOYEE_ID, user?.employeeId);
    this.cls.set<JwtUser>(CLS_USER, user);

    return user as TUser;
  }
}
